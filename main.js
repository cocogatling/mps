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

    alert(
        "Start Time:\n" +
        "Hour: " + startH + "\n" +
        "Min: " + startMin + "\n" +
        "AM/PM: " + startAmPm + "\n\n" +
        "End Time:\n" +
        "Hour: " + endH + "\n" +
        "Min: " + endMin + "\n" +
        "AM/PM: " + endAmPm
      );

    if (!isValidTimePart(sh, sm) || !isValidTimePart(eh, em)) {
      alert("Please enter valid hours (1-12) and minutes (0-59).");
      return;
    }

    const startTime = `${parseInt(sh)}:${sm.padStart(2, '0')}${sap}`;
    const endTime = `${parseInt(eh)}:${em.padStart(2, '0')}${eap}`;

    alert("Start Time: " + startTime + "\nEnd Time: " + endTime);

    document.getElementById("startDisplay").textContent = "Time Started: " + startTime;
    document.getElementById("endDisplay").textContent = "Time Ending: " + endTime;

    document.getElementById("timeSettings").style.display = "none";
  }

  function isValidTimePart(hour, min) {
    const h = parseInt(hour), m = parseInt(min);
    return h >= 1 && h <= 12 && m >= 0 && m <= 59;
  }