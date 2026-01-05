/**
 * global_script.js
 * 
 * Contains global functions and variables used across multiple scripts.
 * Must be included in all HTML files.
 */


// Global variables
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;



function addDBEntry(text){
  fetch("/api/python_code", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content: text})
})
.then(res => res.json())
.then(data => console.log(data));
}


function clickLink(url){
  const link = document.createElement('a');
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



//*************LocalStorage stuff*****************//

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn("localStorage set failed:", e);
    return false;
  }
}

function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn("localStorage get failed:", e);
    return defaultValue;
  }
}

function deleteStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn("localStorage delete failed:", e);
    return false;
  }
}