import Url from "../models/Url.js";
import { nanoid } from "nanoid";

export const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: "originalUrl is required" });
  }

  try {
    // Check if the URL already exists
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json({ shortUrl: `${process.env.BASE_URL}/${existing.shortId}` });
    }

    // Generate a unique shortId
    let shortId;
    let urlExists;
    do {
      shortId = nanoid(6);
      urlExists = await Url.findOne({ shortId });
    } while (urlExists);

    const newUrl = new Url({ shortId, originalUrl });
    await newUrl.save();

    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (url) {
      // Increment click count and update last accessed time
      url.clicks = (url.clicks || 0) + 1;
      url.lastAccessed = new Date();
      await url.save();

      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({ error: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
