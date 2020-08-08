const timeDifference = (current, previous) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute / 3) {
    return 'just now';
  }

  if (elapsed < msPerMinute) {
    return 'less than 1 min ago';
  } else if (elapsed < msPerHour) {
    return `${Math.round(elapsed / msPerMinute)} min ago`;
  } else if (elapsed < msPerDay) {
    return `${Math.round(elapsed / msPerHour)} h ago`;
  } else if (elapsed / msPerMonth) {
    return `${Math.round(elapsed / msPerDay)} days ago`;
  } else if (elapsed / msPerYear) {
    return `${Math.round(elapsed / msPerMonth)} months ago`;
  } else {
    return `${Math.round(elapsed / msPerYear)} years ago`;
  }
};

const timeDifferenceForDate = (date) => {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
};

export { timeDifferenceForDate };
