import express from 'express';
import * as controller from '../controllers/controllers.js';

const router = express.Router();

router.route('/videos').get(controller.getAllVideos);
router
  .route('/videos/:id')
  .get(controller.getVideoById)
  // .post(controller.addVideoById)
  

export default router;