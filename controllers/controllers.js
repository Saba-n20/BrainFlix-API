import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Path to your JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, '../data/video-details.json');

// Function to read videos from the JSON file
const readVideosFromFile = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
    throw new Error('Error reading file');
  }
};

// Function to write videos to the JSON file
const writeVideosToFile = async (videos) => {
  try {
    const jsonString = JSON.stringify(videos, null, 2);
    await fs.writeFile(filePath, jsonString, 'utf8');
  } catch (err) {
    console.error('Error writing file:', err);
    throw new Error('Error writing file');
  }
};

// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await readVideosFromFile();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get a specific video by ID
export const getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;
    if (!videoId) {
      return res.status(400).send('ID is required');
    }

    const videos = await readVideosFromFile();
    const video = videos.find(v => v.id === videoId);

    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).send('Video not found');
    }

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
};

// Add a new video
export const addVideoById = async (req, res) => {
  try {
    const newVideo = { ...req.body };
    console.log('Adding video:', newVideo);

    // Generate a unique UUID
    newVideo.id = uuidv4();
    console.log('New video ID:', newVideo.id);

    const videos = await readVideosFromFile();
    videos.push(newVideo);
    await writeVideosToFile(videos);

    res.status(201).json(newVideo);
    console.log("Added new video:", newVideo);
  } catch (err) {
    if (!res.headersSent) {
      console.error('Server error:', err);
      res.status(500).send('Server error');
    }
  }
};

// Add a new comment to a video
export const addCommentToVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const { name, comment } = req.body;

    // Validate required fields
    if (!videoId || !name || !comment) {
      return res.status(400).send('Video ID, name, and comment are required');
    }

    const videos = await readVideosFromFile();
    const video = videos.find(v => v.id === videoId);

    if (!video) {
      return res.status(404).send('Video not found');
    }

    // Create a new comment object
    const newComment = {
      id: uuidv4(), // Generate a unique ID for the comment
      name,
      comment,
      timestamp: new Date().toISOString()
    };

    // Add the new comment to the video's comments array
    video.comments = video.comments || []; // Initialize comments array if it doesn't exist
    video.comments.push(newComment);
    await writeVideosToFile(videos);

    res.status(201).json(newComment);
    console.log("Added new comment:", newComment);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server error');
  }
};
