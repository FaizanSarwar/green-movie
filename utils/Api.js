import axios from 'axios';

const getApiCall = async (endpoint, ip = null, authCookies = null) => {
  let url = process.env.NEXT_PUBLIC_API_URL;
  url += endpoint;

  const options = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'TGC-API-Authorization': process.env.NEXT_PUBLIC_API_AUTH_KEY,
      Cookie: authCookies,
    },
    withCredentials: true,
  };

  if (ip) {
    options.headers['X-Forwarded-For'] = ip;
  }
  const response = await axios(options);
  return response;
};

const postApiCall = async (endpoint, data, ip = null, authCookies = null) => {
  let url = process.env.NEXT_PUBLIC_API_URL;
  url += endpoint;

  const options = {
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'TGC-API-Authorization': process.env.NEXT_PUBLIC_API_AUTH_KEY,
      Cookie: authCookies,
    },
    withCredentials: true,
    data: JSON.stringify(data) || {},
  };

  if (ip) {
    options.headers['X-Forwarded-For'] = ip;
  }
  const response = await axios(options);
  return response;
};

export { getApiCall, postApiCall };
