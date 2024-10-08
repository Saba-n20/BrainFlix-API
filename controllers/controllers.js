import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';

// Paths
const filePath = path.join(process.cwd(), 'data/video-details.json');
const videosDir = path.join(process.cwd(), 'public/uploads/videos');
const imagesDir = path.join(process.cwd(), 'public/uploads/images');

// Function to ensure upload directories exist
const createUploadDirectories = async () => {
  try {
    await fs.mkdir(videosDir, { recursive: true });
    await fs.mkdir(imagesDir, { recursive: true });
    console.log('Upload directories created successfully.');
  } catch (err) {
    console.error('Error creating upload directories:', err);
  }
};

// Call the function when the server starts
createUploadDirectories();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else if (file.fieldname === 'thumbnail') {
      cb(null, imagesDir);
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: (req, file, cb) => {
    // Use the original filename directly
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Export upload middleware for both video and thumbnail
export const uploadVideo = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

// Function to read videos from the JSON file
const readVideosFromFile = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
    return [];
  }
};

// Function to write videos to the JSON file
const writeVideosToFile = async (videos) => {
  try {
    const jsonString = JSON.stringify(videos, null, 2);
    await fs.writeFile(filePath, jsonString, 'utf8');
  } catch (err) {
    console.error('Error writing file:', err);
  }
};

// Get all videos
export const getAllVideos = async (req, res) => {
  const videos = await readVideosFromFile();
  res.status(200).json(videos);
};

// Get a specific video by ID
export const getVideoById = async (req, res) => {
  const videoId = req.params.id;
  const videos = await readVideosFromFile();
  const video = videos.find(v => v.id === videoId);

  if (video) {
    res.status(200).json(video);
  } else {
    res.status(404).send('Video not found');
  }
};

// Add video 
export const addVideoById = async (req, res) => {
  const { title, description, channel, views, likes, duration, uploadDate } = req.body;
  const videoFile = req.files['video'][0]; // Get the uploaded video file
  const imageFile = req.files['thumbnail'][0]; // Get the uploaded thumbnail file

  if (!videoFile || !imageFile) {
    return res.status(400).send('Both video file and thumbnail are required');
  }

  const newVideo = {
    id: uuidv4(),
    title,
    description,
    channel,
    views,
    likes,
    duration,
    uploadDate,
    video: `${videoFile.filename}`,
    thumbnail: `http://localhost:8081/images/${imageFile.filename}`,
    comments: []
  };

  const videos = await readVideosFromFile();
  videos.push(newVideo);
  await writeVideosToFile(videos);
  res.status(201).json(newVideo);
};

// Add a new comment to a video
export const addCommentToVideo = async (req, res) => {
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
};

// Delete a comment from a video
export const deleteCommentFromVideo = async (req, res) => {
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
};

// Like a comment
export const likeComment = async (req, res) => {
  const { videoId, commentId } = req.params;

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
};
