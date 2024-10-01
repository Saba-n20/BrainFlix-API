import express from 'express';
import * as controller from '../controllers/controllers.js';

const router = express.Router();

// Define routes for videos
router.route('/videos')
  .get(controller.getAllVideos)
  .post(controller.addVideoById);  

// Define routes for a specific video
router.route('/videos/:id')
  .get(controller.getVideoById);

// Define route for adding comments to a specific video
router.post('/videos/:id/comments', controller.addCommentToVideo); 

export default router;
