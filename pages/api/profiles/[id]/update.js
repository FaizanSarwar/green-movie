import { updateProfile } from "../../../../services/tgcApi";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};

const handler = async (req, res) => {
  const profileId = Number(req.query.id || 0);
  const result = await updateProfile(profileId, req.body, req.headers.cookie);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json(result);
  }
};

export default handler;
