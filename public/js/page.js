(function updateDuration() {
  let now = performance.now();
  let nowInMinutes = now / 1000 / 60;
  let hours = Math.floor(nowInMinutes / 60);
  let minutes = Math.round(nowInMinutes % 60);

  let durationStr = "In the past ";

  if (hours > 0) {
    durationStr += `${hours} hour and `;
  }
  
  if (minutes == 1) {
    durationStr += `${minutes} minute`;
  } else {
    durationStr += `${minutes} minutes`;
  }

  duration.textContent = durationStr;

  setTimeout(updateDuration, 1000);
})();