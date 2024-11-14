// routes/socialMediaRoutes.js
import express from 'express';
import { getInstagramFeed } from '../controllers/instagramController.js';

const router = express.Router();

// Define the new route path
router.get('/social-media-feed', getInstagramFeed);

export default router;
