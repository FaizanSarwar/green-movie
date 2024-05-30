// import { updateBillingInfo } from "../../../../services/tgcApi";
import { updateBillingInfo } from '../../services/tgcApi';
import { getClientIp } from '../../utils/getClientIp';

const handler = async (req, res) => {
  const clientIp = getClientIp(req);
  const result = await updateBillingInfo(
    req.body,
    req.headers.cookie,
    clientIp
  );
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json(result);
  }
};

export default handler;
