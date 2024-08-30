const { ipcRenderer } = require('electron');

window.addEventListener('load', () => {
    const content = document.createElement('div');
    content.id = '__int_win_content';

    const header = document.createElement('header');
    header.className = '__int_win_titlebar';


    // Page Buttons
    const pageButtons = document.createElement('div');
    pageButtons.className = '__int_win_box_page_btns';

    const backButton = document.createElement('div');
    backButton.className = '__int_win_opt page_back';
    backButton.id = 'back';
    backButton.innerText = "<";
    backButton.addEventListener('click', () => {
        ipcRenderer.send('pageAction', 'goBack');
    });

    const forwardButton = document.createElement('div');
    forwardButton.className = '__int_win_opt page_forward';
    forwardButton.id = 'forward';
    forwardButton.innerText = ">";
    forwardButton.addEventListener('click', () => {
        ipcRenderer.send('pageAction', 'goForward');
    });

    const refreshButton = document.createElement('div');
    refreshButton.className = '__int_win_opt page_refresh';
    refreshButton.id = 'refresh';
    refreshButton.innerText = "⟳";
    refreshButton.addEventListener('click', () => {
        ipcRenderer.send('pageAction', 'refresh');
    });


    // Action Buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = '__int_win_box_action_btns';

    const closeButton = document.createElement('div');
    closeButton.className = '__int_win_opt window_close';
    closeButton.id = 'close';
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'close');
    });

    const maximizeButton = document.createElement('div');
    maximizeButton.className = '__int_win_opt window_max';
    maximizeButton.id = 'maximize';
    maximizeButton.innerText = '🗖';
    maximizeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'maximize');
    });

    const minimizeButton = document.createElement('div');
    minimizeButton.className = '__int_win_opt window_min';
    minimizeButton.id = 'minimize';
    minimizeButton.innerText = '—';
    minimizeButton.addEventListener('click', () => {
        ipcRenderer.send('windowAction', 'minimize');
    });

    // Title page
    const titlePage = document.createElement('p');
    titlePage.className = '__int_win_title';
    var newTitle = document.title.substring(0, 55);
    if(document.title.length > 55){
        titlePage.innerText = "Minif Browser - " + newTitle + "...";
    } else {
        titlePage.innerText = "Minif Browser - " + newTitle;
    }



    // Add page buttons
    pageButtons.appendChild(backButton)
    pageButtons.appendChild(refreshButton)
    pageButtons.appendChild(forwardButton)
    header.appendChild(pageButtons);

    // Add Title page
    header.appendChild(titlePage)

    // Add actions buttons
    actionButtons.appendChild(minimizeButton);
    actionButtons.appendChild(maximizeButton);
    actionButtons.appendChild(closeButton);
    header.appendChild(actionButtons);

    content.appendChild(header);

    document.body.prepend(content);

    ipcRenderer.send('loadFile', 'styles');
    ipcRenderer.on('loaded-styles', (e, stylesData) => {
        const style = document.createElement('style');
        style.textContent = stylesData;
        document.head.appendChild(style);
    })

});
