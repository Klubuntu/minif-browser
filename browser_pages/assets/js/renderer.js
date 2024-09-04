const { ipcRenderer, ipcMain } = require('electron');

var oldURL = "";

const setWebviewSize = () => {
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;

    const webviewElm = document.querySelector("webview");
    webviewElm.style.width = (windowWidth + 15) + "px";
    webviewElm.style.height = (windowHeight - 50) + "px";
}

setWebviewSize();
window.addEventListener("DOMContentLoaded", () => {

    setWebviewSize();

    window.onresize = setWebviewSize;

    /* Event listeners */
    const webviewElm = document.querySelector("webview");
    const titlePage = document.querySelector(".__int_win_title");
    const urlInput = document.querySelector(".__int_win_url");

    // Page Buttons
    const backButton = document.querySelector(".__int_win_opt.page_back");
    const forwardButton = document.querySelector(".__int_win_opt.page_forward");
    const refreshButton = document.querySelector(".__int_win_opt.page_refresh");

    backButton.addEventListener('click', () => {
        webviewElm.goBack();
    });

    forwardButton.addEventListener('click', () => {
        webviewElm.goForward();
    });

    refreshButton.addEventListener('click', () => {
        webviewElm.reload();
    });


    // Action Buttons
    const closeButton = document.querySelector(".__int_win_opt.window_close")
    const maximizeButton = document.querySelector(".__int_win_opt.window_max")
    const minimizeButton = document.querySelector(".__int_win_opt.window_min")

    closeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'close');
    });
    maximizeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'maximize');
    });
    minimizeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'minimize');
    });


    webviewElm.addEventListener('did-fail-load', (e,) => {
        console.log(e)
        if (e.errorCode === -2) {
            webviewElm.loadURL("browser://error/file");
        }
        if (e.errorCode === -6) {
            webviewElm.loadURL("browser://error/file");
        }
        if (e.errorCode === -105) {
            webviewElm.loadURL("browser://error/not_resolved");
        }
        if (e.errorCode === -200) {
            webviewElm.loadURL("browser://error/cert");
        }
        if (e.errorCode === -201) {
            webviewElm.loadURL("browser://error/cert_date");
        }
        if (e.errorCode === -300) {
            // webviewElm.loadURL("browser://error/invalid_url");
            if(/^https?:\/\//.test(oldURL) == false){
                const searchURL = "https://www.google.com/search?q="
                const searchQuery = searchURL + oldURL;
                console.log(searchQuery)
                webviewElm.loadURL(searchQuery);
            } else {
                webviewElm.loadURL("browser://error/invalid_url");
            }
        }
    })

    webviewElm.addEventListener('did-start-loading', () => {
        var newTitle = webviewElm.getTitle().substring(0, 55);
        if (document.title.length > 55) {
            titlePage.innerText = "Minif Browser - " + newTitle + "...";
        } else {
            titlePage.innerText = "Minif Browser - " + newTitle;
        }
        urlInput.value = webviewElm.getURL();
    })

    webviewElm.addEventListener('dom-ready', () => {
        var newTitle = webviewElm.getTitle().substring(0, 55);
        if (document.title.length > 55) {
            titlePage.innerText = "Minif Browser - " + newTitle + "...";
        } else {
            titlePage.innerText = "Minif Browser - " + newTitle;
        }
        urlInput.value = webviewElm.getURL();
    })

    titlePage.addEventListener("click", () => {
        titlePage.style.display = "none";
        urlInput.style.display = "block";
    })
    urlInput.addEventListener("dblclick", () => {
        urlInput.style.display = "none";
        titlePage.style.display = "block";
    })
    urlInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            oldURL = urlInput.value
            webviewElm.loadURL(urlInput.value)
            urlInput.style.display = "none";
            titlePage.style.display = "block";
        }
    })
})

