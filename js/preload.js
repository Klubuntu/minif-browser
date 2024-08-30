const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const content = document.createElement('div');
    content.id = '__int_win_content';

    const header = document.createElement('header');
    header.className = '__int_win_titlebar';

    const closeButton = document.createElement('div');
    closeButton.className = '__int_win_opt close';
    closeButton.id = 'close';
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'close');
    });

    const maximizeButton = document.createElement('div');
    maximizeButton.className = '__int_win_opt max';
    maximizeButton.id = 'maximize';
    maximizeButton.innerText = '🗖';
    maximizeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'maximize');
    });

    const minimizeButton = document.createElement('div');
    minimizeButton.className = '__int_win_opt min';
    minimizeButton.id = 'minimize';
    minimizeButton.innerText = '—';
    minimizeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'minimize');
    });

    header.appendChild(closeButton);
    header.appendChild(maximizeButton);
    header.appendChild(minimizeButton);

    content.appendChild(header);

    document.body.prepend(content);

    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0 auto;
            position: relative;
            top: 49px;
        }
        .__int_win_titlebar {
            display: flex;
            flex-direction: row-reverse;
            justify-content: flex-start;
            background: #353535;
            color: black;
            align-self: stretch;
            -webkit-app-region: drag;
        }
        #__int_win_content {
            position: fixed;
            top: 0;
            z-index: 9999999;
            display: flex;
            width: 100%;
            flex-direction: column;
            background: black;
            align-items: center;
        }
        .__int_win_opt {
            color: white;
            padding: 3px 10px;
            font-size: 16px;
            cursor: pointer;
            -webkit-app-region: no-drag;
        }
        .option:hover {
            background: red;
        }
    `;

    // Append the style element to the head
    document.head.appendChild(style);
});
