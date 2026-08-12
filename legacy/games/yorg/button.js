const buildButton = document.getElementById('build-button');
const ribbon = document.getElementById('ribbon');
const closeButton = document.getElementById("close-button");
const menu = document.getElementById("menu");

function toggle() {
    const menuHidden = menu.style.display === "none" || menu.style.display === "";
    ribbon.style.display = menuHidden ? "block" : "none";
    buildButton.style.display = menuHidden ? "none" : "block";
    menu.style.display = menuHidden ? "flex" : "none";
}

buildButton.addEventListener('click', toggle);
closeButton.addEventListener("click", toggle);

// Close the menu when clicking outside of it
document.addEventListener('click', function(event) {
    if (!ribbon.contains(event.target) && event.target !== buildButton) {
        ribbon.style.display = "none";
        buildButton.style.display = 'block';
        menu.style.display = "none"; // Hide the menu when closing
    }
});