const remoteMain = require('@electron/remote/main')
remoteMain.initialize()

const { app, protocol, net, BrowserWindow, ipcMain } = require('electron');
const protocols = require('electron-protocols');
const path = require('node:path')
const url = require('node:url')

let win;

protocols.register('browser', uri => {
    let root = app.getAppPath();
    // App Pages
    if (uri.hostname == "start") {
        return path.join(root, "demo", "home.html")
    }
    if (uri.hostname == "demo") {
        return path.join(root, "demo", "test.html")
    }
    // Error Pages
    if ((uri.hostname + uri.path) == "error/file") {
        return path.join(root, "demo", "error", "file_err.html")
    }
    if ((uri.hostname + uri.path) == "error/404") {
        return path.join(root, "demo", "error", "404.html")
    }
    if ((uri.hostname + uri.path) =="error/cert") {
        return path.join(root, "demo", "error", "cert_err.html")
    }
    if ((uri.hostname + uri.path) =="error/cert_date") {
        return path.join(root, "demo", "error", "cert_date_err.html")
    }
    if ((uri.hostname + uri.path) == "error/invalid_url") {
        return path.join(root, "demo", "error", "invalid_url_err.html")
    }
    if ((uri.hostname + uri.path) == "error/not_resolved") {
        return path.join(root, "demo", "error", "resolved_err.html")
    }
});

function createWindow() {
    win = new BrowserWindow({
        width: 980,
        height: 552,
        titleBarOverlay: false,
        resizable: true,
        show: true,
        transparent: true,
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
    win.loadURL("browser://start")
    win.webContents.on('did-fail-load', (e, errorCode, errorDescription, validatedURL) => {
        console.log(errorCode, ": ", errorDescription);
        const errorPages = path.join(__dirname, 'demo', 'error')
        if (errorCode === -2) {
            win.loadURL("browser://error/file_err");
        }
        if (errorCode === -6) {
            win.loadURL("browser://error/file");
        }
        if (errorCode === -105) {
            win.loadURL("browser://error/invalid_url");
        }
        if (errorCode === -200) {
            win.loadURL("browser://error/cert");
        }
        if (errorCode === -201) {
            win.loadURL("browser://error/cert_date");
        }
        if (errorCode === -300) {
            win.loadURL("browser://error/invalid_url");
        }
    });
    win.webContents.on('did-start-navigation', (e, navigateUrl) => {
    });
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

    ipcMain.on("changeUrl", (e, url) => {
        console.log("Url:", url)
        win.loadURL(url)
    })


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
    if (action == "styles") {
        const fs = require('fs')
        const stylesData = fs.readFileSync(path.join(__dirname, "css", 'internal.css')).toString()
        e.sender.send("loaded-styles", stylesData)
        return
    }
    if (action == "nav_left") {
        const fs = require('fs')
        const iconData = fs.readFileSync(path.join(__dirname, "assets", "icons", 'nav_left.png'))
        const iconBase = iconData.toString('base64')
        e.sender.send("loaded-icon-left", iconBase)
        return
    }
    if (action == "nav_reload") {
        const fs = require('fs')
        const iconData = fs.readFileSync(path.join(__dirname, "assets", "icons", 'nav_refresh.png'))
        const iconBase = iconData.toString('base64')
        e.sender.send("loaded-icon-reload", iconBase)
        return
    }
    if (action == "nav_right") {
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
        if (win.isMaximized()) {
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


