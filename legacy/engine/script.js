const fileList = document.getElementById('fileList');
const editor = document.getElementById('editor');
const newFileBtn = document.getElementById('newFileBtn');
const downloadZipBtn = document.getElementById('downloadZipBtn');
const tabsContainer = document.getElementById('tabs');

let files = {}; // Object to hold file names and their contents
let currentFile = null;

function updateFileExplorer() {
    fileList.innerHTML = '';
    for (const fileName in files) {
        const li = document.createElement('li');
        li.textContent = fileName;
        li.onclick = () => openFile(fileName);
        li.oncontextmenu = (e) => {
            e.preventDefault();
            showContextMenu(e, fileName);
        };
        fileList.appendChild(li);
    }
}

function openFile(fileName) {
    currentFile = fileName;
    editor.value = files[fileName];
    updateTabs(fileName);
}

function updateTabs(fileName) {
    // Remove active class from all tabs
    Array.from(tabsContainer.children).forEach(tab => tab.classList.remove('active'));

    // Check if the tab already exists
    let tab = document.querySelector(`.tab[data-filename="${fileName}"]`);

    if (!tab) {
        // Create a new tab
        tab = document.createElement('div');
        tab.className = 'tab';
        tab.textContent = fileName;
        tab.setAttribute('data-filename', fileName);
        tab.onclick = () => {
            currentFile = fileName;
            editor.value = files[fileName];
            updateTabs(fileName);
        };

        // Add close button to the tab
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✖';
        closeBtn.className = 'close-btn';
        closeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent tab click event
            closeTab(fileName);
        };
        tab.appendChild(closeBtn);

        tabsContainer.appendChild(tab);
    }

    tab.classList.add('active'); // Mark this tab as active
}

function closeTab(fileName) {
    delete files[fileName];
    updateFileExplorer();

    // Remove tab from the UI
    const tab = document.querySelector(`.tab[data-filename="${fileName}"]`);
    if (tab) {
        tabsContainer.removeChild(tab);
    }

    // Clear the editor if the closed tab was active
    if (currentFile === fileName) {
        editor.value = '';
        currentFile = null;
    }
}

// Add this line to prevent the default context menu from showing up in the file explorer
fileExplorer.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent the default context menu
    showContextMenu(e, null); // Pass null for the fileName since it's a general context menu
});

// Update the showContextMenu function to check if fileName is null
function showContextMenu(e, fileName) {
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.style.left = `${e.pageX}px`;

    contextMenu.innerHTML = `
        <button onclick="newFile()">New File</button>
        <button onclick="downloadAllAsZip()">Download All as ZIP</button>
    `;

    if (fileName) {
        contextMenu.innerHTML += `
            <button onclick="renameFile('${fileName}')">Rename</button>
            <button onclick="deleteFile('${fileName}')">Delete</button>
        `;
    }

    document.body.appendChild(contextMenu);

    document.addEventListener('click', () => {
        document.body.removeChild(contextMenu);
    }, { once: true });
}

// Update the file list context menu event
fileList.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent the default context menu
    const fileName = e.target.textContent; // Get the file name of the right-clicked item
    showContextMenu(e, fileName); // Show context menu with file options
});


function newFile() {
    const newName = prompt('Enter new file name (with extension):', 'newfile.txt');
    if (newName && !files[newName]) {
        files[newName] = '';
        updateFileExplorer();
        openFile(newName); // Automatically open the new file
    }
}

async function downloadAllAsZip() {
    const zip = new JSZip();
    for (const [fileName, content] of Object.entries(files)) {
        zip.file(fileName, content);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


function renameFile(fileName) {
    const newName = prompt('Enter new file name:', fileName);
    if (newName && !files[newName]) {
        files[newName] = files[fileName];
        delete files[fileName];
        updateFileExplorer();
        updateTabs(newName);
    }
}

function deleteFile(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        delete files[fileName];
        updateFileExplorer();
        closeTab(fileName);
    }
}

/* newFileBtn.onclick = () => {
    const newName = prompt('Enter new file name (with extension):', 'newfile.txt');
    if (newName && !files[newName]) {
        files[newName] = '';
        updateFileExplorer();
        openFile(newName); // Automatically open the new file
    }
}; */

editor.addEventListener('input', () => {
    if (currentFile) {
        files[currentFile] = editor.value;
    }
});

/* downloadZipBtn.onclick = async () => {
    const zip = new JSZip();
    for (const [fileName, content] of Object.entries(files)) {
        zip.file(fileName, content);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}; */

updateFileExplorer();
