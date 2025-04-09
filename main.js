let startDate = null;
let endDate = null;
let updateInterval = null;

function toggleTimeInputs() {
    const settings = document.getElementById("timeSettings");
    settings.style.display = settings.style.display === "none" ? "block" : "none";
  }
  
function saveTimes() {
const startH = document.getElementById("startHour").value;
const startMin = document.getElementById("startMin").value;
const startAmPm = document.getElementById("startAmPm").value;

const endH = document.getElementById("endHour").value;
const endMin = document.getElementById("endMin").value;
const endAmPm = document.getElementById("endAmPm").value;

// Convert to Date
function getDateFromInput(hour, min, ampm) {
    let h = parseInt(hour);
    let m = parseInt(min);
    if (ampm === "pm" && h !== 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
}

startDate = getDateFromInput(startH, startMin, startAmPm);
endDate = getDateFromInput(endH, endMin, endAmPm);

// Start or restart interval
if (updateInterval) clearInterval(updateInterval);
updateTimeDisplays(); // Run immediately once
updateInterval = setInterval(updateTimeDisplays, 60000); // Then every minute
}

function updateTimeDisplays() {
const now = new Date();

let timePassedMS = now - startDate;
let timeLeftMS = endDate - now;

timePassedMS = Math.max(0, timePassedMS);
timeLeftMS = Math.max(0, timeLeftMS);

function msToTime(ms) {
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}min`;
}

document.getElementById("timePassed").textContent = "Time Passed: " + msToTime(timePassedMS);
document.getElementById("timeLeft").textContent = "Time Left: " + msToTime(timeLeftMS);
}