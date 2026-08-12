const directories = document.querySelectorAll('.directory');
const currentDirectory = document.getElementById('current-directory');
const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const backButton = document.getElementById('back-button');
let previousDirectory = '/'; // To store the previous directory for back navigation
let currentPath = '/'; // To track the current path

for (const directory of directories) {
  directory.addEventListener('dblclick', () => {
    const directoryName = directory.getAttribute('data-directory');
    navigateToDirectory(directoryName);
  });
}

searchButton.addEventListener('click', () => {
  const inputDirectory = searchBar.value.trim();
  if (inputDirectory) {
    navigateToDirectory(inputDirectory);
  }
});

backButton.addEventListener('click', () => {
  navigateToDirectory(previousDirectory);
});

function navigateToDirectory(directory) {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = ''; // Clear previous file listings
  previousDirectory = currentPath; // Store current path for back navigation
  currentPath = `/${directory}`;

  // Sample file structure
  const files = {
    Documents: ['Resume.docx', 'CoverLetter.pdf', 'ProjectNotes.txt'],
    Downloads: ['Setup.exe', 'Image.png', 'Report.xlsx'],
    Pictures: ['Vacation.jpg', 'Family.png', 'Birthday.png'],
    Music: ['Song1.mp3', 'Album.zip', 'Podcast.mp3'],
    Videos: ['Movie.mp4', 'Clip.avi', 'Documentary.mkv']
  };

  // Check if the directory exists
  if (files[directory]) {
    currentDirectory.textContent = `Current Directory: ${currentPath}`;
    // Display the files
    for (const file of files[directory]) {
      const fileItem = document.createElement('div');
      fileItem.classList.add('directory');
      fileItem.innerHTML = `<img src="file-icon.png" alt="File" class="icon"> <span class="name">${file}</span>`;
      fileList.appendChild(fileItem);
    }
    backButton.style.display = 'inline'; // Show back button
  } else {
    alert('Invalid directory!'); // Alert for invalid directory
    currentPath = previousDirectory; // Reset current path
    currentDirectory.textContent = `Current Directory: ${currentPath}`; // Reset current directory text
  }
}
