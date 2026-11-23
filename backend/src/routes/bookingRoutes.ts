import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
import { 
  createBooking, 
  getMyBookings, 
  getHostBookings,
  getBookingById, 
  cancelBooking,
  payBooking,
  getAllBookings,
} from '../controllers/BookingController';

const router = express.Router();

// Skydda alla endpoints globalt i denna modul
router.use(verifyToken);

router.route('/').post(createBooking);
router.route('/my-bookings').get(getMyBookings);
router.route('/host').get(checkRole(['host', 'admin']), getHostBookings);
router.route('/all').get(checkRole(['admin']), getAllBookings);
router.route('/:id').get(getBookingById);
router.route('/:id/cancel').patch(cancelBooking);
router.route('/:id/pay').post(payBooking);

export default router;