import { deleteProfile } from "../../../../services/tgcApi";

const handler = async (req, res) => {
  const profileId = Number(req.query.id || 0);
  const result = await deleteProfile(profileId, req.headers.cookie);

  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json(result);
  }
};

export default handler;