const requestIp = require('request-ip');

export const getClientIp = (req) => {
  const clientIp = requestIp.getClientIp(req);
  const ip = clientIp.split(':').reverse()[0];
  return ip;
};
