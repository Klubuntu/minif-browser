const { BrowserWindow } = require('@electron/remote')

const getWindow = () => BrowserWindow.getFocusedWindow();

Array.from(document.getElementsByClassName('close')).map((val) => {
    val.addEventListener('click', e => {
        const window = getWindow()
        window.destroy()
        document.activeElement.blur()
    })
})

Array.from(document.getElementsByClassName('min')).map((val) => {
    val.addEventListener('click', e => {
        const window = getWindow()
        window.minimize()
        document.activeElement.blur()
    })
})

Array.from(document.getElementsByClassName('max')).map((val) => {
    val.addEventListener('click', e => {
        const window = getWindow()
        window.maximize()
        document.activeElement.blur()
    })
})
