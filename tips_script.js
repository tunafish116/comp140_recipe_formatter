window.onload = () =>
document.getElementById("dark-stylesheet").disabled = !getStorage("dark-mode", isDarkMode);

function back_clicked(){
    clickLink("index.html");
}