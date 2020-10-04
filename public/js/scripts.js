(function updateDuration() {
  let now = performance.now();
  let nowInMinutes = now / 1000 / 60;
  let hours = Math.floor(nowInMinutes / 60);
  let minutes = Math.round(nowInMinutes % 60);

  let durationStr = "";
  // Within this minute
  // In this 1 minute
  // In these 2 minutes
  // In this 1 hour
  // In this 1 hour and 1 minute
  // In these 1 hour and 2 minutes
  // In these 2 hours
  // In these 2 hours and 1 minute
  // In these 2 hours and 2 minutes
  if (hours == 0 && minutes == 0) {
    durationStr = "Within this minute";
  } else {
    durationStr = "In ";
    if (hours == 1 || (hours == 0 && minutes == 1)) {
      durationStr += "this ";
    } else {
      durationStr += "these ";
    }
    if (hours > 0) {
      if (hours == 1) {
        durationStr = hours + " hour";
        if (minutes > 0) {
          durationStr += " and ";
        }
      } else {
        durationStr += hours + " hours";
        if (minutes > 0) {
          durationStr += " and ";
        }
      }
    }
    if (minutes > 0) {
      if (minutes == 1) {
        durationStr += minutes + " minute";
      } else {
        durationStr += minutes + " minutes";
      }
    }
  }

  duration.textContent = durationStr;

  setTimeout(updateDuration, 1000);
})();