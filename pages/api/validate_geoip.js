import { validateGeoIP } from '../../services/tgcApi';
import { getClientIp } from '../../utils/getClientIp';

const handler = async (req, res) => {
  const clientIp = getClientIp(req);
  const result = await validateGeoIP(clientIp);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(403).json(result);
  }
};

export default handler;
