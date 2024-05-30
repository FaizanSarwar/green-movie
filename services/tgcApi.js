import { getApiCall, postApiCall } from '../utils/Api';

export const getGenres = async (ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/films/genres';

    const result = await getApiCall(endpoint, ip);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getCarouselFilms = async (ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/site/tgc-select';

    const result = await getApiCall(endpoint, ip);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getFilmsList = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/films';

    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getSeriesList = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/series';

    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const signInUser = async ({ username, password }) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/login';

    const result = await postApiCall(endpoint, { username, password });
    response.headers = result.headers;
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const signUpUser = async (data) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/register';
    const result = await postApiCall(endpoint, data);

    response.headers = result.headers;
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }
  return response;
};

export const registerGuestUser = async () => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/guest';

    const result = await getApiCall(endpoint);
    response.headers = result.headers;
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getSavedFilmPosition = async (filmId, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/film/${filmId}/position`;

    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const saveFilmPosition = async (
  { filmId, posInSec },
  authCookies,
  ip
) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/film/position';
    const result = await postApiCall(
      endpoint,
      { film_id: filmId, position_seconds: posInSec },
      ip,
      authCookies
    );
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getProfiles = async (authCookies) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/profiles';
    const result = await getApiCall(endpoint, null, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const deleteProfile = async (profileId, authCookies) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/profiles/${profileId}/delete`;
    const result = await getApiCall(endpoint, null, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const updateProfile = async (profileId, data, authCookies) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/profiles/${profileId}/update`;
    const result = await postApiCall(endpoint, data, null, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const createProfile = async (data, authCookies) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/profiles/create`;
    const result = await postApiCall(endpoint, data, null, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const selectProfile = async (profileId, authCookies) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/profiles/${profileId}/select`;
    const result = await getApiCall(endpoint, null, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const validateUser = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/validate';
    const result = await getApiCall(endpoint, ip, authCookies);
    response.headers = result.headers;
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const createSubscription = async (data, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/subscription/create`;
    const result = await postApiCall(endpoint, data, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const userBillingInfo = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/billing`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getGuestData = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/tgc-select-v2`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getPrivacyData = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/privacy-policy`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getAboutData = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/about`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getCareersData = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/careers`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getSubmitFilmData = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/submit-your-film`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const stayInTouch = async (data, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/newsletter-form`;
    const result = await postApiCall(endpoint, data, ip, authCookies);

    response.headers = result.headers;
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg ||
      'We are sorry, Something went wrong. Please check your connection and try again.';
  }
  return response;
};

export const postContactusData = async (data, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/contact-form`;
    const result = await postApiCall(endpoint, data, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      ' We are sorry, something went wrong. Please check your information and try again.';
  }

  return response;
};

export const updateBillingInfo = async (data, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/billing/update`;
    const result = await postApiCall(endpoint, data, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getFaqData = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/faq`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getTermsData = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/tos`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const search = async (searchKeyword, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/search?q=${searchKeyword.searchData}`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getSimilarDataList = async (id, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/film/${id}/similar`;

    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const cancelSubscription = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/subscription/cancel`;

    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const sampleContent = async (id, authCookies) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/sample-content`;

    const result = await getApiCall(endpoint, id, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const forgotPassword = async ({ email }, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/password/forgot';

    const result = await postApiCall(endpoint, { email }, ip);
    // response.headers = result.headers;
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const resetPassword = async ({ code, email, password }, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/password/reset';
    let obj = { code };
    if (email) {
      obj = { code, email, password };
    }

    const result = await postApiCall(endpoint, obj, ip);
    // response.headers = result.headers;
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const validateGeoIP = async (ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/site/geoip/validate';

    const result = await getApiCall(endpoint, ip);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const getAntiSpam = async (authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/site/anti-spam`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const rentFilm = async (id, authCookies, ip) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = `/wp-json/tgc/v1/user/film/${id}/rental-request`;
    const result = await getApiCall(endpoint, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export const modifySubscription = async (data, ip, authCookies) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/subscription/modify';

    const result = await postApiCall(endpoint, data, ip, authCookies);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};
