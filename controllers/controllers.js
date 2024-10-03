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
    const videos = await readVideosFromFile();
    const video = videos.find(v => v.id === videoId);

    if (video) {
      res.status(200).json(video);
    } else {
      res.status(404).send('Video not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Add a new video
export const addVideoById = async (req, res) => {
  try {
    const newVideo = { ...req.body, id: uuidv4() };
    const videos = await readVideosFromFile();
    videos.push(newVideo);
    await writeVideosToFile(videos);
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Add a new comment to a video
export const addCommentToVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const { name, comment } = req.body;

    if (!videoId || !name || !comment) {
      return res.status(400).send('Video ID, name, and comment are required');
    }

    const videos = await readVideosFromFile();
    const video = videos.find(v => v.id === videoId);

    if (!video) {
      return res.status(404).send('Video not found');
    }

    const newComment = {
      id: uuidv4(),
      name,
      comment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    video.comments = video.comments || [];
    video.comments.push(newComment);
    await writeVideosToFile(videos);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Delete a comment from a video
export const deleteCommentFromVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const commentId = req.params.commentId;

    if (!videoId || !commentId) {
      return res.status(400).send('Video ID and Comment ID are required');
    }

    const videos = await readVideosFromFile();
    const video = videos.find(v => v.id === videoId);

    if (!video) {
      return res.status(404).send('Video not found');
    }

    const originalCommentCount = video.comments.length;
    video.comments = video.comments.filter(comment => comment.id !== commentId);

    if (video.comments.length === originalCommentCount) {
      return res.status(404).send('Comment not found');
    }

    await writeVideosToFile(videos);
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Like a comment
export const likeComment = async (req, res) => {
  const { videoId, commentId } = req.params;

  try {
    const videos = await readVideosFromFile();
    const video = videos.find(v => v.id === videoId);

    if (!video) {
      return res.status(404).send('Video not found');
    }

    const comment = video.comments.find(c => c.id === commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    comment.likes = (comment.likes || 0) + 1;
    await writeVideosToFile(videos);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
