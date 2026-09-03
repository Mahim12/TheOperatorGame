const appRoot = document.getElementById("app-root");

// 1. Load the Menu when the app starts
document.addEventListener("DOMContentLoaded", () => {
  loadScreen("menu.html");
});

// 2. The core navigation function
async function loadScreen(htmlFile) {
  try {
    // Fetch the HTML file
    const response = await fetch(htmlFile);
    const html = await response.text();

    // Inject it into the master shell
    appRoot.innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${htmlFile}:`, error);
  }
}
