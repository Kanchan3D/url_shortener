import mongoose from "mongoose";

// Validator function for URLs
const urlValidator = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate shortIds
    trim: true,
  },
  originalUrl: {
    type: String,
    required: true,
    unique: true, // optional: ensures no duplicate original URLs
    validate: [urlValidator, "Please provide a valid URL"],
  },
  clicks: {
    type: Number,
    default: 0,
  },
  lastAccessed: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster lookups
urlSchema.index({ shortId: 1 });
urlSchema.index({ originalUrl: 1 }); // optional, ensures uniqueness


const Url = mongoose.model("Url", urlSchema);

export default Url;
