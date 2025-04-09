//Initial Data
var mData = {
    startDate: null,
    endDate: null,
    totalEarnings: 0, // Global
    lastTick: Date.now()
}

const savedData = JSON.parse(localStorage.getItem("mSave"));
if (savedData !== null) {
  console.log("Loaded saved shift data:", savedData);
  mData = savedData;

  totalEarnings = mData.totalEarnings;
  startDate = new Date(mData.startDate);
  endDate = new Date(mData.endDate);
  mData.lastTick = Date.now();

  applySavedDataToUI(); // custom function we'll define next

  updateTimeDisplays(); // show immediately
  if (updateInterval) clearInterval(updateInterval);
  updateInterval = setInterval(updateTimeDisplays, 60000); // every minute
}

function applySavedDataToUI() {
document.getElementById("thisShiftDisplay").textContent = "$$$ This Shift: $" + totalEarnings.toFixed(2);

// Optional: display saved start/end times (manually format if needed)
updateTimeDisplays();
}

function applyShiftEarnings() {
const dollars = parseInt(document.getElementById("shiftDollars").value || "0");
const cents = parseInt(document.getElementById("shiftCents").value || "0");
totalEarnings = dollars + cents / 100;
mData.totalEarnings = totalEarnings;
mData.lastTick = Date.now();

document.getElementById("thisShiftDisplay").textContent = "$$$ This Shift: $" + totalEarnings.toFixed(2);
updateTimeDisplays();
saveMData();
}

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

  // Sanity check
  if (endDate <= startDate) {
    alert("End time must be after start time.");
    return;
  }

  // Start or restart interval
  if (updateInterval) clearInterval(updateInterval);
  updateTimeDisplays(); // Run immediately once
  updateInterval = setInterval(updateTimeDisplays, 60000); // Then every minute

  startDate = getDateFromInput(startH, startMin, startAmPm);
  endDate = getDateFromInput(endH, endMin, endAmPm);

  mData.startDate = startDate.toISOString();
  mData.endDate = endDate.toISOString();
  mData.lastTick = Date.now();
  saveMData();
}

function updateTimeDisplays() {
  const now = new Date();

  let timePassedMS = now - startDate;
  let timeLeftMS = endDate - now;
  let totalShiftMS = endDate - startDate;

  timePassedMS = Math.max(0, timePassedMS);
  timeLeftMS = Math.max(0, timeLeftMS);
  totalShiftMS = Math.max(1, totalShiftMS); // avoid divide by 0

  function msToTime(ms) {
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}min`;
  }

  document.getElementById("timePassed").textContent = "Time Passed: " + msToTime(timePassedMS);
  document.getElementById("timeLeft").textContent = "Time Left: " + msToTime(timeLeftMS);

  // ✅ Calculate MPM (Money per minute)
  const totalShiftMin = totalShiftMS / 60000;
  const mpm = totalEarnings / totalShiftMin;

  document.getElementById("mpmDisplay").textContent = "MPM: $" + mpm.toFixed(2) + "/min";

  // ✅ Use MPM * time passed (in minutes) for earned so far
  const minutesPassed = timePassedMS / 60000;
  const earnedSoFar = roundToNearestFiveCents(minutesPassed * mpm);
  const leftToEarn = roundToNearestFiveCents(Math.max(0, totalEarnings - earnedSoFar));

  document.getElementById("earnedSoFarDisplay").textContent = "$$$ Earned so far: $" + earnedSoFar.toFixed(2);
  document.getElementById("leftToEarnDisplay").textContent = "$$$ Left to earn: $" + leftToEarn.toFixed(2);
}

// Round to nearest $0.05
function roundToNearestFiveCents(amount) {
  return Math.round(amount * 20) / 20;
}

var savedGame = JSON.parse(localStorage.getItem("musicSave"));
if (savedGame !== null) {
    console.log("Loaded game data:", savedGame);
    gameData = savedGame;

    const now = Date.now();
    const offlineTime = (now - gameData.lastTick) / 1000; // in seconds
    const offlineGain = gameData.mps * offlineTime;
    gameData.music += offlineGain;
    gameData.lastTick = now;

    if (offlineGain > 0) {
        // Format time away
        const seconds = Math.floor(offlineTime % 60);
        const minutes = Math.floor((offlineTime / 60) % 60);
        const hours = Math.floor(offlineTime / 3600);
        const timeAway =
            (hours > 0 ? `${hours}h ` : "") +
            (minutes > 0 ? `${minutes}m ` : "") +
            `${seconds}s`;

        alert(`You were away for ${timeAway} and gained ${format(offlineGain)} music!`);
    }

    update("musicMade", `${format(gameData.music)} Music Made`);
    update("musicAutoMade", `${format(gameData.mps)} Mps`);
    update("musicBoxesMade", `${format(gameData.musicBoxes)} Music Boxes`);
    updateMusicBoxButton();
} else {
    console.log("No saved game data found.");
}


// Function to save the game state into localStorage
function saveMData() {
    localStorage.setItem("mSave", JSON.stringify(mData));  // Save the entire game data object
}