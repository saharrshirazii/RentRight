import express from 'express';
import { verifyToken } from '../middleware/authMiddleware'; 
import { 
  createBooking, 
  getMyBookings, 
  getBookingById, 
  cancelBooking 
} from '../controllers/BookingController';

const router = express.Router();

//Protect all endpoints globally inside this routing module
router.use(verifyToken);

router.route('/').post(createBooking);

router.route('/my-bookings').get(getMyBookings);

router.route('/:id').get(getBookingById);

router.route('/:id/cancel').patch(cancelBooking);

export default router;