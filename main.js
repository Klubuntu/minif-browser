const remoteMain = require('@electron/remote/main')
remoteMain.initialize()

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 980,
        height: 552,
        titleBarOverlay: false,
        resizable: true,
        show: true,
        frame: false,
        center: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, "js", 'preload.js')
        },
        backgroundColor: '#171614'
    })
    remoteMain.enable(win.webContents)

    // win.loadURL("https://google.com/search?q=test")
    win.loadFile("demo/test.html")
    win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript(`
            const content = document.querySelector('#content');
            if (content) {
                content.style.display = 'block';
            }
        `);

        win.show();
        win.webContents.openDevTools();
    });


    ipcMain.on('pageAction', async (e, action) => {
        console.log(action)
        if (action == "goBack") {
            win.webContents.goBack()
            e.sender.send('Backward page', 'Done')
            return
        }
        if (action == "goForward") {
            win.webContents.goForward()
            e.sender.send('Forward page', 'Done')
            return
        }
        if (action == "refresh") {
            win.webContents.reload()
            e.sender.send('Refresh page', 'Done')
            return
        }
    })

}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on("loadFile", (e, action) => {
    if(action == "styles"){
        const fs = require('fs')
        const stylesData = fs.readFileSync(path.join(__dirname, "css", 'internal.css')).toString()
        e.sender.send("loaded-styles", stylesData)
        return
    }
    if(action == "nav_left"){
        const fs = require('fs')
        const iconData = fs.readFileSync(path.join(__dirname, "assets", "icons", 'nav_left.png'))
        const iconBase = iconData.toString('base64')
        e.sender.send("loaded-icon-left", iconBase)
        return
    }
    if(action == "nav_reload"){
        const fs = require('fs')
        const iconData = fs.readFileSync(path.join(__dirname, "assets", "icons", 'nav_refresh.png'))
        const iconBase = iconData.toString('base64')
        e.sender.send("loaded-icon-reload", iconBase)
        return
    }
    if(action == "nav_right"){
        const fs = require('fs')
        const iconData = fs.readFileSync(path.join(__dirname, "assets", "icons", 'nav_right.png'))
        const iconBase = iconData.toString('base64')
        e.sender.send("loaded-icon-right", iconBase)
        return
    }
})

ipcMain.on("windowAction", (e, action) => {
    console.log(action)
    if (action == "close") {
        app.quit()
        return
    }
    if (action == "minimize") {
        win.minimize()
        return
    }
    if (action == "maximize") {
        if(win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
        return
    }
    if (action == "unmaximize") {
        win.unmaximize()
        win.center()
        return
    }
})


