// utils.js

function isWithinTime(startTime, endTime) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const startTimeInMinutes = startHours * 60 + startMinutes;
  const endTimeInMinutes = endHours * 60 + endMinutes;

  if (startTimeInMinutes > endTimeInMinutes) {
    if (
      currentTime >= startTimeInMinutes ||
      currentTime <= endTimeInMinutes
    ) {
      return true;
    }
  } else {
    if (
      currentTime >= startTimeInMinutes &&
      currentTime <= endTimeInMinutes
    ) {
      return true;
    }
  }

  return false;
}

window.isWithinTime = isWithinTime;