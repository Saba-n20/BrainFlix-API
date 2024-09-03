import express from 'express';
import * as controller from '../controllers/controllers.js';

const router = express.Router();

router.route('/videos')
  .get(controller.getAllVideos)
  .post(controller.addVideoById);  

router.route('/videos/:id')
  .get(controller.getVideoById);

// // Comment routes
// router.route('/videos/:id/comments')
//   .post(controller.addComment);

export default router;
