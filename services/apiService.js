import axios from 'axios';
import { getApiCall, postApiCall } from '../utils/Api';

/** Auth Services */
const stayInTouch = async ({ firstName, lastName, email }) => {
  const response = {
    success: true,
  };

  const url = `${process.env.NEXT_PUBLIC_API}/stay_in_touch`;
  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ firstName, lastName, email }) || {},
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const signUpUser = async ({ username, password, email }) => {
  const response = {
    success: true,
  };

  const url = `${process.env.NEXT_PUBLIC_API}/sign_up`;
  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ username, password, email }) || {},
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const signInUser = async ({ username, password }) => {
  const response = {
    success: true,
  };

  const url = `${process.env.NEXT_PUBLIC_API}/sign_in`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ username, password }) || {},
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const logOutUser = async () => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/logout';

    const result = await getApiCall(endpoint);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const saveFilmPosition = async ({ filmId, posInSec }) => {
  const response = {
    success: true,
  };

  const url = `${process.env.NEXT_PUBLIC_API}/film_position`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    data: JSON.stringify({ filmId, posInSec }) || {},
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const getFilmPosition = async (filmId) => {
  const response = {
    success: true,
  };

  const url = `${process.env.NEXT_PUBLIC_API}/get_position`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    data: JSON.stringify({ filmId }) || {},
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const getFilmsStatus = async () => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/films/status';

    const result = await getApiCall(endpoint);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

/** Data Services */
const getGenres = async (data) => {
  const url = `${process.env.NEXT_PUBLIC_API}/geners`;

  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data) || {},
  };

  const response = await axios(options);
  return response.data;
};

const getCarouselFilms = async (data) => {
  const url = `${process.env.NEXT_PUBLIC_API}/carousel_films`;

  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data) || {},
  };

  const response = await axios(options);
  return response.data;
};

const getFilmsList = async (data) => {
  const url = `${process.env.NEXT_PUBLIC_API}/features`;

  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data) || {},
  };

  const response = await axios(options);
  return response.data;
};

const getSeriesList = async (data) => {
  const url = `${process.env.NEXT_PUBLIC_API}/series`;

  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data) || {},
  };

  const response = await axios(options);
  return response.data;
};

const getFilmsByGenre = async (genreString) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/films';

    const result = await getApiCall(endpoint);
    if (result.data.status === 'success') {
      // eslint-disable-next-line max-len
      const filteredList = result.data.data.filter((film) =>
        film.genres?.includes(genreString)
      );
      const retData = { ...result.data, data: filteredList };
      response.data = retData;
    } else {
      response.data = { ...result.data, data: [] };
    }
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getSeriesByGenre = async (genreString) => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/user/series';

    const result = await getApiCall(endpoint);
    if (result.data.status === 'success') {
      // eslint-disable-next-line max-len
      const filteredList = result.data.data.filter((series) =>
        series.genres?.includes(genreString)
      );
      const retData = { ...result.data, data: filteredList };
      response.data = retData;
    } else {
      response.data = { ...result.data, data: [] };
    }
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

/** CMS Services */
const getTermAndServicesData = async () => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/site/tos';

    const result = await getApiCall(endpoint);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getSubscriptionDiscription = async () => {
  const response = {
    success: true,
  };

  try {
    const endpoint = '/wp-json/tgc/v1/site/subscription/description';

    const result = await getApiCall(endpoint);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getUserProfiles = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/profiles`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const deleteUserProfile = async (profileId) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/profiles/${profileId}/delete`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const updateUserProfile = async (profileId, data) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/profiles/${profileId}/update`;

    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data,
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const createUserProfile = async (data) => {
  const response = {
    success: true,
  };
  const url = `${process.env.NEXT_PUBLIC_API}/profiles/create`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    data,
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const selectUserProfile = async (profileId) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/profiles/${profileId}/select`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const validateUser = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/validate_user`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const createSubscription = async (data) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/subscription`;
    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data,
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong *****.';
  }

  return response;
};

const userBillingInfo = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/billing`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getGuestData = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/guest`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getPrivacyData = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/privacy`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getAboutData = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/about`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getCareersData = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/careers`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getSubmitFilmData = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/submitfilm`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const contactus = async (data) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/contactus`;

    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data,
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const updateUserBilling = async (data) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/update_billing`;

    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data,
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getFaqData = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/faq`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getTermsData = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/terms`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const search = async (searchData) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/search`;

    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: { searchData },
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const getSimilarDataList = async (data) => {
  const url = `${process.env.NEXT_PUBLIC_API}/similar_content`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data },
  };

  const response = await axios(options);
  return response.data;
};

const cancelSubscription = async (data) => {
  const url = `${process.env.NEXT_PUBLIC_API}/cancel_subscription`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { data },
  };

  const response = await axios(options);
  return response.data;
};

const getSampleContent = async () => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/sample_content`;

    const options = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: {},
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const forgotPassword = async ({ email }) => {
  const response = {
    success: true,
  };

  const url = `${process.env.NEXT_PUBLIC_API}/forgot_password`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ email }) || {},
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const resetPassword = async ({ code, password, email }) => {
  const response = {
    success: true,
  };

  const url = `${process.env.NEXT_PUBLIC_API}/reset_password`;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ code, password, email }) || {},
  };

  const result = await axios(options);
  response.data = result.data;
  return response;
};

const validateGeoIP = async (data) => {
  const url = `${process.env.NEXT_PUBLIC_API}/validate_geoip`;

  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data) || {},
  };

  const response = await axios(options);
  return response.data;
};

const rentFilm = async (filmId) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/rental-film/`;
    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: { id: filmId },
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

const modifySubscription = async (data) => {
  const response = {
    success: true,
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_API}/modify_subscription`;

    const options = {
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data,
    };

    const result = await axios(options);
    response.data = result.data;
  } catch (error) {
    response.success = false;
    response.message =
      error?.response?.data?.status_msg || 'Something went wrong.';
  }

  return response;
};

export {
  stayInTouch,
  signUpUser,
  signInUser,
  logOutUser,
  saveFilmPosition,
  getFilmsStatus,
  getCarouselFilms,
  getGenres,
  getFilmsList,
  getSeriesList,
  getFilmsByGenre,
  getSeriesByGenre,
  getTermAndServicesData,
  getSubscriptionDiscription,
  getFilmPosition,
  getUserProfiles,
  deleteUserProfile,
  updateUserProfile,
  createUserProfile,
  selectUserProfile,
  validateUser,
  createSubscription,
  userBillingInfo,
  getGuestData,
  getPrivacyData,
  getAboutData,
  getCareersData,
  getSubmitFilmData,
  contactus,
  updateUserBilling,
  getFaqData,
  getTermsData,
  search,
  getSimilarDataList,
  cancelSubscription,
  getSampleContent,
  forgotPassword,
  resetPassword,
  validateGeoIP,
  rentFilm,
  modifySubscription,
};
