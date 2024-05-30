export const filterGenreData = (data, genre) => {
  const retData = [];
  data.forEach((f) => {
    if (f.genres?.includes(genre)) {
      retData.push(f);
    }
  });

  return retData;
};

export const filterUniqueGenres = (data, exclude = '') => {
  const retData = [];
  data.forEach((f) => {
    f.genres?.forEach((g) => {
      if (!retData.includes(g) && g !== exclude) {
        retData.push(g);
      }
    });
  });

  return retData;
};

export const filterGenreWiseData = (data, genres) => {
  const retData = {};
  genres.forEach((g) => {
    const checkFilms = data.filter((f) => f.genres.includes(g));
    if (checkFilms.length > 0) {
      retData[g] = checkFilms;
    }
  });

  return retData;
};

export const formatName = (name) => {
  return name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

export const sequenceSeasons = (seasons) => {
  return seasons.sort(function (a, b) {
    if (a.text < b.text) {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return 0;
  });
};

const addDateSuffix = (d) => {
  if (d > 3 && d < 21) return `${d}th`;
  switch (d % 10) {
    case 1:
      return `${d}st`;
    case 2:
      return `${d}nd`;
    case 3:
      return `${d}rd`;
    default:
      return `${d}th`;
  }
};

export const getExpiryDays = (data, isSample = false) => {
  if (isSample) {
    let endDate = new Date(Math.round(data?.period_end));
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const availabilityEndDate = new Intl.DateTimeFormat(
      'en-GB',
      options
    ).format(endDate);

    const splitData = availabilityEndDate.split(' ');
    const retDate = `${addDateSuffix(splitData[0])} ${splitData[1]} ${
      splitData[2]
    } `;
    return retDate;
  }
  const startTime = Math.round(Date.now() / 1000); // data?.period_start || 0;
  const expiryDate = Number(data?.period_end) || 0;
  return Math.round((expiryDate - startTime) / (60 * 60 * 24));
};
