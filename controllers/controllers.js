import videos from "../data/video-details.js";
import { v4 as uuidv4 } from 'uuid'; 

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

// Add a new video
export const addVideoById = (req, res) => {
  try {
    const newVideo = { ...req.body };
    console.log('Adding video:', newVideo);

    // Generate a unique UUID
    newVideo.id = uuidv4();

    console.log('New video ID:', newVideo.id);
    
    videos.push(newVideo);
    res.status(201).json(newVideo);
    console.log("Added new video:", newVideo);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
};

export const addComment = (req, res) => {
    try {
      const videoId = req.params.id;
      const { text, author } = req.body;
  
      if (!text || !author) {
        return res.status(400).send('Comment text and author are required');
      }
  
      const video = videos.find(v => v.id === videoId);
      
      if (!video) {
        return res.status(404).send('Video not found');
      }
  
      const newComment = {
        id: uuidv4(),
        text,
        author,
        date: new Date().toISOString()
      };
  
      video.comments.push(newComment);
  
      res.status(201).json(newComment);
      console.log("Added new comment:", newComment);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).send('Server error');
    }
  };