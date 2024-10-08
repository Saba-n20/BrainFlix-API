import express from 'express';
import * as controller from '../controllers/controllers.js';

const router = express.Router();

// Define routes for videos
router.route('/videos')
  .get(controller.getAllVideos)          
  .post(controller.uploadVideo, controller.addVideoById); // Add a new video with upload middleware

// Define routes for a specific video
router.route('/videos/:id')
  .get(controller.getVideoById); // Fetch a specific video by ID

// Define routes for comments associated with a specific video
router.route('/videos/:id/comments')
  .post(controller.addCommentToVideo); // Add comments to a specific video

// Define route for deleting a comment
router.delete('/videos/:id/comments/:commentId', controller.deleteCommentFromVideo);

// Define route for liking a comment
router.post('/videos/:videoId/comments/:commentId/like', controller.likeComment);

export default router;
