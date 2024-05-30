import { getProfiles } from "../../../services/tgcApi";

const handler = async (req, res) => {
  const result = await getProfiles(req.headers.cookie);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json(result);
  }
};

export default handler;