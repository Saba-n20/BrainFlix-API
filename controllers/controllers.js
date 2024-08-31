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

// Get a specific video by ID
export const getVideoById = (req, res) => {
    try {
      const videoId = req.params.id;
      if (!videoId) {
        return res.status(400).send('ID is required');
      }
      console.log('Received video ID:', videoId);
      
      const video = videos.find(v => v.id === videoId);
      
      if (video) {
        res.status(200).json(video);
      } else {
        res.status(404).send('Video not found');
      }
      
      console.log("Fetched video with ID:", videoId);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).send('Server error');
    }
  };