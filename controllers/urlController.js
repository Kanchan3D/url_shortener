import Url from "../models/Url.js";
import { nanoid } from "nanoid";

export const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(6);
  const newUrl = new Url({ shortId, originalUrl });

  await newUrl.save();
  res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
};

export const redirectUrl = async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
};
