let count = 0;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

fetch(`/api/counter?name=about`)
    .then(res => res.json())
    .then(data => {
        count = data.count;
        playAnimation();
    });
fetch(`/api/counter?name=join_us`)
    .then(res => res.json())
    .then(data => {
      document.getElementById(`join-us-count-p`).textContent = data.count
      +" people interested in joining";
    });
fetch(`/api/counter?name=back_to_safety`)
    .then(res => res.json())
    .then(data => {
      document.getElementById(`tec-count-p`).textContent = data.count
      +" redirects to Tec's twitter"
    });

function back_to_safety_clicked(){
  fetch("/api/counter", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "back_to_safety" }),
    keepalive: true
   });
  clickLink("https://x.com/tecariowolf");
}

function join_us_clicked(){
  fetch("/api/counter", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "join_us" }),
    keepalive: true
  })
}

quadEaseOut = t => t * (2 - t);
const animationDuration = 1200; // 1.2 seconds
const frameTime = 40; // 40 ms, 25 FPS

async function playAnimation(){
    let header = document.getElementById("flashbang-count-h1");
    for(let i=0; i<1; i+=frameTime/animationDuration){
        let eased = quadEaseOut(i);
        let displayCount = Math.floor(eased * count);
        header.textContent = displayCount + 
        " people were flashbanged by this page.";
        await sleep(frameTime);
    }
    header.textContent = count + 
        " people were flashbanged by this page.";
}