import express from 'express';
import * as controller from '../controllers/controllers.js';

const router = express.Router();

router.route('/videos')
  .get(controller.getAllVideos)
  .post(controller.addVideoById);  // Ensure POST is correctly defined here

router.route('/videos/:id')
  .get(controller.getVideoById);

export default router;
