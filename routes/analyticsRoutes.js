import express from 'express';
import { getAnalyticsData } from '../controllers/analyticsController.js';

const router = express.Router();

// Route to fetch analytics data
router.get('/stats', getAnalyticsData);

export default router;
