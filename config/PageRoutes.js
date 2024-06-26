// Page urls
const PageRoutes = {
  HOME: '/',
  BROWSE: '/browse',
  // FEATURES: '/features',
  FEATURES_PAGE: '/features/:genre',
  // SERIES: '/series',
  SERIES_GENRE_PAGE: '/series/:genre',
  SERIES_DETAILS_PAGE: '/series-details/:id',
  SERIES_DETAILS_EPISODE_PAGE: '/series-details/:id/:season/:epsId',
  SERIES_DETAILS_SEASON_PAGE: '/series-details/:id/:season',
  FILM_DETAILS_PAGE: '/film-details/:id',
  // SHORTS: '/shorts',
  // SHORTS_GENRE_PAGE: '/shorts/:genre',
  SIGNIN: '/signin',
  SIGNOUT: '/signout',
  SIGNUP: '/signup',
  ACCOUNT: '/account',
  PROFILES: '/profiles',
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  ANTISPAM: '/anti-spam',
  FAQ: '/faq',
  SEARCH: '/search',
  CAREERS: '/careers',
  SUBMITYOURFILM: '/submitfilm',
  CONTACTUS: '/contactus',
  SAMPLECONTENT: '/video-on-demand',
  FORGOTPASSWORD: '/forgot-password',
  RESETPASSWORD: '/reset-password',
  SELECTPLAN: '/product-plans',
  DONATE: '/donate',
  FORBIDDEN: '/forbidden',
};

export default PageRoutes;
