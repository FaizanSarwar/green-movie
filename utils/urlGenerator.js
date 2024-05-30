import PageRoutes from '../config/PageRoutes';

export const generateSubGenrelUrl = (baseUrl, genre) => {
  let url = baseUrl;
  const slug = genre
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  url = url.replace(':genre', slug);

  return url;
};

export const genreateDetailsPageUrl = ({
  id = null,
  type = null,
  from = 'subscription'
}) => {
  let url =
    type === 'film' || type === 'films'
      ? PageRoutes.FILM_DETAILS_PAGE
      : PageRoutes.SERIES_DETAILS_PAGE;

  url = url.replace(':id', id);

  return `${url}?from=${from}`;
};

export const generateEpisodeUrl = (id, epsId, season) => {
  let url = PageRoutes.SERIES_DETAILS_EPISODE_PAGE;

  url = url.replace(':id', id);
  url = url.replace(':season', season);
  url = url.replace(':epsId', epsId);
  return url;
};

export const generateSeasonUrl = (id, season) => {
  let url = PageRoutes.SERIES_DETAILS_SEASON_PAGE;

  url = url.replace(':id', id);
  url = url.replace(':season', season);
  return url;
};
