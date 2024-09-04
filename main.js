const remoteMain = require('@electron/remote/main')
remoteMain.initialize()

const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const protocols = require('electron-protocols');
const path = require('node:path')

let win;

protocols.register('browser', uri => {
    let root = app.getAppPath();
    // App Pages
    if (uri.hostname == "start") {
        return path.join(root, "browser_pages", "home.html")
    }
    if (uri.hostname == "browser_pages") {
        return path.join(root, "browser_pages", "test.html")
    }
    if (uri.hostname == "help") {
        return path.join(root, "browser_pages", "help.html")
    }
    // Error Pages
    if ((uri.hostname + uri.path) == "error/file") {
        return path.join(root, "browser_pages", "error", "file_err.html")
    }
    if ((uri.hostname + uri.path) == "error/404") {
        return path.join(root, "browser_pages", "error", "404.html")
    }
    if ((uri.hostname + uri.path) =="error/cert") {
        return path.join(root, "browser_pages", "error", "cert_err.html")
    }
    if ((uri.hostname + uri.path) =="error/cert_date") {
        return path.join(root, "browser_pages", "error", "cert_date_err.html")
    }
    if ((uri.hostname + uri.path) == "error/invalid_url") {
        return path.join(root, "browser_pages", "error", "invalid_url_err.html")
    }
    if ((uri.hostname + uri.path) == "error/not_resolved") {
        return path.join(root, "browser_pages", "error", "resolved_err.html")
    }
});

function createWindow() {
    win = new BrowserWindow({
        width: 980,
        height: 552,
        icon: path.join(__dirname, 'assets/icons/logo/256x256.png'),
        titleBarOverlay: false,
        resizable: true,
        show: true,
        transparent: true,
        frame: false,
        center: true,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webviewTag: true,
        },
    })
    remoteMain.enable(win.webContents)

    // win.loadURL("browser://frame")
    win.loadFile("browser_pages/frame.html")
    win.webContents.on('did-fail-load', (e, errorCode, errorDescription, validatedURL) => {
        console.log(errorCode, ": ", errorDescription);
        if (errorCode === -2) {
            win.loadURL("browser://error/file");
        }
        if (errorCode === -6) {
            win.loadURL("browser://error/file");
        }
        if (errorCode === -105) {
            win.loadURL("browser://error/not_resolved");
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
        win.webContents.executeJavaScript(`// Code to execute - before load page`);
    });
    win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript(`
            const content = document.querySelector('#content');
            if (content) {
                content.style.display = 'block';
            }
        `);

        win.show();
    });

    win.webContents.on('blur', () => {
        globalShortcut.unregisterAll()
        console.warn("Not focusing");
    })

    win.webContents.on('focus', () => {
        globalShortcut.register('F1', () => {
            console.log('Loading help')
            win.webContents.executeJavaScript("document.querySelector('webview').loadURL('browser://help')")
        })
        globalShortcut.register('Shift+F12', () => {
            console.log('Opening app dev_tool')
            win.webContents.openDevTools();
        })
        globalShortcut.register('F12', () => {
            console.log('Opening dev_tool')
            win.webContents.executeJavaScript("document.querySelector('webview').openDevTools()");
        })
        globalShortcut.register('Ctrl+Shift+I', () => {
            console.log('Opening dev_tool')
            win.webContents.executeJavaScript("document.querySelector('webview').openDevTools()");
        })
        globalShortcut.register('Ctrl+R', () => {
            win.webContents.executeJavaScript("document.querySelector('webview').reload()");
        })
        globalShortcut.register('Alt+L', () => {
            win.webContents.executeJavaScript("document.querySelector('webview').goBack()");
        })
        globalShortcut.register('Alt+R', () => {
            win.webContents.executeJavaScript("document.querySelector('webview').goForward()");
        })
        globalShortcut.register('Ctrl+N', () => {
            createWindow()
        })
        console.warn("Focusing");
    })


    ipcMain.on('pageAction', async (e, action) => {
        console.log(action)
        if (action == "goBack") {
            win.webContents.navigationHistory.goBack()
            e.sender.send('Backward page', 'Done')
            return
        }
        if (action == "goForward") {
            win.webContents.navigationHistory.goForward()
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


