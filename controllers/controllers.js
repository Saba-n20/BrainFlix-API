import videos from "../data/video-details.js";

// Get all videos
export const getAllVideos = (req, res) => {
  try {
    res.status(200).json(videos);
    console.log("Fetched all videos");
  } catch (err) {
    res.status(500).send('Server error');
  }
};