const formatDuration = (sec) => {
  let secs = sec;
  if (!secs && secs <= 0) {
    return '00:00:00';
  }

  let hours = null;
  if (secs / 3600 > 0) {
    hours = Math.floor(secs / 3600);
    secs -= hours * 3600;
  } else {
    hours = 0;
  }

  let mins = null;
  if (secs / 60 > 0) {
    mins = Math.floor(secs / 60);
    secs -= mins * 60;
  } else {
    mins = 0;
  }

  secs = Math.floor(secs);

  const hoursString = hours >= 10 ? String(hours) : `0${String(hours)}`;
  const minsString = mins >= 10 ? String(mins) : `0${String(mins)}`;
  const remainderString = secs >= 10 ? String(secs) : `0${String(secs)}`;
  return `${hoursString}:${minsString}:${remainderString}`;
};
export default formatDuration;
