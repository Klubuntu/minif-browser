const setWebviewSize = () => {
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    
    const webviewElm = document.querySelector("webview");
    webviewElm.style.width = windowWidth + "px";
    webviewElm.style.height = windowHeight + "px";
}

setWebviewSize();
window.addEventListener("DOMContentLoaded", () => {
    setWebviewSize();
  
    window.onresize = setWebviewSize;
})