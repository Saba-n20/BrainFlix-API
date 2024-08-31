import express from 'express';


const router = express.Router();

router.route('/videos').get(controller.getAllVideos);
router
  .route('/videos/:id')
  .get(controller.getVideoById)
  // .post(controller.addVideoById)
  

export default router;