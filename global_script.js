/**
 * global_script.js
 * 
 * Contains global functions and variables used across multiple scripts.
 * Must be included in all HTML files.
 */


// Global variables
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;



async function addDBEntry(text) {
  const response = await fetch("/api/python_code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text })
  });
  const data = await response.json();

  if (!response.ok || data.error || data.success === false) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  console.log(data);
  await submit();
}

async function submit() {
    const userId = getStorage("user_id");
    const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({user_id: userId})
    });

    if (!response.ok) {
        throw new Error("Submission failed");
    }

    const result = await response.json();

    setStorage("user_id", result.user_id);
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