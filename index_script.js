// index.html references
let textInput = document.getElementById("text-input");
let textOutput = document.getElementById("text-output");
let settingsContainer = document.getElementById("settings-container");
let darkStylesheet = document.getElementById("dark-stylesheet");
let darkToggle = document.getElementById("dark-toggle");
let commentToggle = document.getElementById("comment-toggle");
let methodToggle = document.getElementById("method-toggle");

// Initialize settings from localStorage
window.onload = () =>
applySettings();

// Load stored text from localStorage on page load
let storedText = getStorage("code-text");
if(storedText){
  console.log(storedText);
  textInput.value = storedText;
}

// Register user on page load
fetch("/api/users", {
  method: "POST"
});

// Save text to localStorage before unloading the page
window.addEventListener("beforeunload", () => {
  setStorage("code-text", textInput.value);
});



function generate_recipe_clicked() {
    let text = textInput.value;
    addDBEntry(text);
    text = "padding_DoTpBBEFqY\n"+text+"\npadding";



    const variableRegex = /\b(?:for|while)\s+(\w+).+:|\b(\w+)\s*=[^=]/g;
    let variableBank = new Set();
    const parameterRegex = /def\s+(\w+)\s*\(([^)]*)\)/g;
    let match;

    while ((match = variableRegex.exec(text)) !== null) {
      // one of the capture groups will be defined
      variableBank.add(match[1] || match[2]);
    }


    while ((match = parameterRegex.exec(text)) !== null) {
      const params = match[2]
        .split(",")
        .map(p => p.trim())
        .filter(Boolean);
      params.forEach(param => {
        variableBank.add(param);
      });
    }

    // special case for <sub> tag
    if(variableBank.has("sub")){
      variableBank.delete("sub");
      variableBank.add("%sub%");
      text = text.replaceAll(/\bsub\b/g, "%sub%");
    }

    const mapRegex = /\b(\w+)\s*=\s*\{.*\}/g;
    let mapBank = new Set();
    while ((match = mapRegex.exec(text)) !== null) {
      mapBank.add(match[1]);
    }
    console.log("variables:");
    console.log(variableBank);
    console.log("maps:");
    console.log(mapBank);


    text = text.replaceAll("for ", "for each ");
    text = text.replaceAll("elif ", "otherwise if ");
    text = text.replaceAll(/(for each|while)(.*):\s*\n/g, "<b>$1</b>$2 <b>do</b>\n");
    text = text.replaceAll(/(if.*)\sin\s/g, "$1 is in ");
    text = text.replaceAll(/(if.*)\snot\sis\s/g, "$1 is not ");
    text = text.replaceAll(/(if|otherwise if|else)(.*):\s*\n/g, "<b>$1</b>$2 <b>then</b>\n");
    text = text.replaceAll(/([\w\[\]\(\)_]+)\s?([\+-/\*])=\s?("?[\w\[\]\(\)]+"?)/g, "$1 = $1 $2 $3");
    text = text.replaceAll(/\s*!=\s*/g," ≠ ");
    text = text.replaceAll(/\s*<=\s*/g," ≤ ");
    text = text.replaceAll(/\s*>=\s*/g," ≥ ");
    text = text.replaceAll("=","←");
    text = text.replaceAll("←←","=");
    text = text.replaceAll(/([<>])\u2190/g,"$1=");
    const appendRegex = /(\w+)\.append\((.+)\)\s*\n/g;
    text = text.replaceAll(appendRegex, "append $2 to the end of $1\n");
    text = text.replaceAll(/\s*\*\*\s*2/g,"²");
    text = text.replaceAll(/len\(\s*(\w+)\s*\)/g, "the length of $1");
    text = text.replaceAll(/(\w+)\s*\*\*\s*0\.5/g,"the square root of $1");
    text = text.replaceAll(/\s*\*\*\s*/g," to the power of ");
    text = text.replaceAll(/sorted\(\s*(\w+)\s*\)/g,"$1 sorted in ascending alhpanumeric order");
    text = text.replaceAll(/float\(\s*["'](-?)inf['"]\)/g, "$1∞");
    text = text.replaceAll("None", "<i>null</i>");
    text = text.replaceAll(/math.sqrt\((.+)\)/g,"the square root of ($1)");
    text = text.replaceAll(/tuple\((.+)\)/g,"$1");



    const subsequenceRegex = /(\w+)\[\s*([^:\]]*)\s*:\s*([^:\]]*)\s*\]/g;
    text = text.replaceAll(subsequenceRegex, (match, thing1, thing2, thing3) => {
      const start = thing2.trim()? `${thing1}<sub>`+thing2.trim()+`</sub>` : `the start of ${thing1}`;
      const end = thing3.trim()? `${thing1}<sub>`+thing3.trim()+`</sub>` : `the end of ${thing1}`;
      return `a subsequence of ${thing1} from ${start} to ${end}`;
    });


    text = text.replaceAll(/random.random\(\)/g, "a random real number ≥ 0 and < 1, chosen with a uniform distribution");
    text = text.replaceAll(/random.randint\(\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/g, "a random integer ≥ $1 and ≤ $2 chosen with uniform distribution");
    text = text.replaceAll(
      /range\(\s*(.+)\s*,\s*(.+)\s*\)/g,
      (match, a, b) => {
        let result = ``
        if(isNaN(a)){
          result = `the sequence ${a},${a + "+1"},...,`;
        }else{
          a = parseInt(a);
          result = `the sequence ${a},${a + 1},...,`;
        }
        if(isNaN(b)){
          if(/\+\s?1\s?$/.test(b)){
            result += `${b.replace(/\+\s?1\s?$/,"")}`;
          }else{
            result += `${b+"-1"}`;
          }
        }else{
          b = parseInt(b);
          result += `${b-1}`;
        }
        return result;
      }
    );
    text = text.replaceAll(/range\(\s*(.+)\s*\)/g, (match, a) => {
      result = "the sequence 0,1,...,"
      if(isNaN(a)){
        if(/\+\s?1\s?$/.test(a)){
          result += `${a.replace(/\+\s?1\s?$/,"")}`;
        }else{
          result += `${a+"-1"}`;
        }
      }else{
        a = parseInt(a);
        result += `${a-1}`;
      }
      return result;
    }
    );
    text = text.replaceAll(/(\s*)(\w+\s*←\s*)(\w+)\.pop\(\s*(\w+)\s*\)/g, "$1$2$3<sub>$4</sub>$1remove the element at index $4 from $3");
    text = text.replaceAll(/(\w+)\.pop\(\s*(\w+)\s*\)/g, "remove the element at index $2 from $1");
    text = text.replaceAll(/(\w+)\.insert\(\s*(\w+)\s*,\s*(\w)\s*\)/g, "insert $3 into $1 at index $2");
    text = text.replaceAll(/(\w+)\.keys\(\)/g, "the keys of $1");
    text = text.replaceAll(/(\w+)\.values\(\)/g, "the values of $1");
    text = text.replaceAll(/(\w+)\[\s?-1\s?\]/g, "the last element of $1");
    text = text.replaceAll(/def\s+(\w+).+/g,"<b>Name:</b> $1");
    if(settings.formatMethods){
      text = text.replaceAll(/(\w+)\.(\w+\([^\)]*\))/g, "the value returned by calling $2 on the object $1");
    }else{
      text = text.replaceAll(/(\w+\.\w+\([^\)]*\))/g,
        "<mark title=\"Replace method calls with recipe syntax.\">$1</mark>"
      );
    }
    if(settings.removeComments){
      text = text.replaceAll(/\n?\s*#.*\n/g, "\n");
    }else{
      text = text.replaceAll(/(#.*)\n/g,
        "<mark title=\"Remove all comments from final recipe.\">$1</mark>\n"
      );
    }

    // if array is actually map, make assignments correspondences instead
    mapBank = [...mapBank];
    mapBank = mapBank.join('|');
    const mapCorrespondence = new RegExp(`(${mapBank})\\[([^\\]]+)\\]\\s*←\\s*(.+)`,'g');
    if(mapBank != ""){
      text = text.replaceAll(mapCorrespondence, 'add a new correspondence $2 ↦ $3 to the map $1');
    }
    //array index to subscript
    text = text.replaceAll(/(\w+)\[([^\]\[]+)\](?![\[\]])/g, "$1<sub>$2</sub>");

    // set to array
    let variableArray = [...variableBank];
    let variableString = variableArray.join('|');
    const italicize = new RegExp(`([^\\w])(${variableString})([^\\w>])`,'g');


    
    if(variableString != ""){
      //ensure that there is a 2 character gap between variables so regex can capture all variables
      text = text.replaceAll(",",", "); 
      //italicize variables
      text = text.replaceAll(italicize, '$1<i>$2</i>$3');
      //restore commas
      text = text.replaceAll(", ",",");
    }

    text = text.replaceAll("return ","<b>return</b> ");
    

    text = text.replaceAll(/\{\s?\}/g, "an empty map");
    text = text.replaceAll(/\{\s?(\w+)\s?:\s?(\w+)\s?\}/g, "a map with the correspondence $1 ↦ $2");
    text = text.replaceAll(/\[\s?\]/g, "an empty sequence");

    text = text.replaceAll(/[Ii]nput(s?):/g, "<b>Input$1:</b>");
    text = text.replaceAll(/[Rr]eturns:/g, "<b>Output:</b>");
    text = text.replaceAll(/(\n\s*"""\s*\n)/g,"\n\n");

    // explicit list re-format
    text = text.replaceAll(/(^\w|\s)\[(.+)\]/g,"$1$2");



    // restore reserved <sub> tag
    if(variableBank.has("%sub%")){
      text = text.replaceAll(/%sub%/g, "sub");
    }



    
    // **** OTHER CODE FORMAT WARNINGS ****
    text = text.replaceAll(/((?:\[.+\])+)/g,
      "<mark title=\"Nested indexing is not allowed in recipes.\">$1</mark>"
    );
    text = text.replaceAll(/ (floats?) /g,
      " <mark title=\"Floats do not exist in recipe syntax.\">$1</mark> "
    );
    text = text.replaceAll(/(<i>.{1,2}<\/i>)/g,
      " <mark title=\"Variable names must be at least 3 characters long.\">$1</mark> "
    );




    // remove padding
    text = text.slice(19,-8);



/** what to replace
 * = > <--
 * : > , do
 * for > for each
 * else, do > else, then
 * *a*.append(*b*) > append *b* to *a*
 * len(*a*) > the length of *a*
 * *a*[*b*:*c*] > subsequence of *a* from *b* to *c*
 * if b or c is empty, replace b or c with "the start of *a*" and "the end of *a*" respectively
 * *a*[*b*] > *a*_*b*
 * range(*a*) > the sequence 0,1,2,..., *a*
 * *a*[+*-/]<--*b* > *a*<--*a*[+*-/]*b*
 ** list(*a*) > a copy of *a*
 ** when talking about dictionaries: in > is in the keys of 
 * random.randint(*a*,*b*) > a random integer >= *a* and <= *b* chosen with uniform distribution
 * random.random() > a random real number >= 0 and < 1, chosen with a uniform distribution
 * word starts with a letter
 * any word not defined not defined in python syntax is underlined
 * 
 * ways for creating new variables
 * 1. parameter
 * 2. <--
 * 3. for, while
 * 
 * For classes:
 * find and store class name: class ******
 * replace __init___ with Initialize*className*
 * within a class, if variables start with _, delete it. Actually, just delete all _var
 * 
 * 
 * 
 */ 

    console.log(text);
    textOutput.innerHTML = text;

    if(text.includes("</mark>")){
      document.getElementById("warning-text").hidden = false;
    }else{
        document.getElementById("warning-text").hidden = true;
    }
}

function unindent_clicked() {
    let text = textOutput.innerHTML;
    // a little bit of jank code to fix consecutive line breaks
    text = "\n"+text;
    text = text.replaceAll("\n\n","\n:\n");
    text = text.replaceAll(/\n\s{4}/g,"\n"); // this is the one that actually un-indents
    text = text.replaceAll("\n:\n","\n\n");
    console.log(text);
    text = text.slice(1);
    textOutput.innerHTML = text;
}

function about_clicked(){
  fetch("/api/counter", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "about" }),
    keepalive: true
  });
  clickLink("about.html");
}

function hide_warnings_clicked(){
  let text = textOutput.innerHTML;
  text = text.replaceAll(/<\/?mark[^>]+>/g, "");
  console.log(text);
  textOutput.innerHTML = text;
  document.getElementById("warning-text").hidden = true;
}

function tips_clicked(){
  fetch("/api/counter", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "tips" }),
    keepalive: true
  });
  clickLink("tips.html");
}

function settings_clicked(){
  fetch("/api/counter", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "settings" }),
  });
  settingsContainer.style.display = "block";
  darkToggle.checked = settings.darkMode;
  commentToggle.checked = settings.removeComments;
  methodToggle.checked = settings.formatMethods;
}


// Update dark mode stylesheet based on toggle
darkToggle.addEventListener("change", () => {
    fetch("/api/counter", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "dark_mode" }),
    });
    darkStylesheet.disabled = !darkToggle.checked;
});

function saveSettings(){
    setStorage("dark-mode", darkToggle.checked);
    setStorage("remove-comments", commentToggle.checked);
    setStorage("format-methods", methodToggle.checked);
    applySettings();
    settingsContainer.style.display = "none";
}

function cancelSettings(){
    settingsContainer.style.display = "none";
    applySettings();
}

function applySettings(){
  settings = {
    darkMode: getStorage("dark-mode", isDarkMode),
    removeComments: getStorage("remove-comments", true),
    formatMethods: getStorage("format-methods", false)
  };
  darkStylesheet.disabled = !settings.darkMode;
}

function restoreDefault(){
    darkToggle.checked = isDarkMode;
    commentToggle.checked = true;
    methodToggle.checked = false;
}