import express from 'express';
import { verifyToken } from '../middleware/authMiddleware'; 
import { 
  createBooking, 
  getMyBookings, 
  getHostBookings,
  getBookingById, 
  cancelBooking,
   payBooking,
} from '../controllers/BookingController';

const router = express.Router();



router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getMyBookings);
router.get('/host', verifyToken, getHostBookings);
router.get('/:id', verifyToken, getBookingById);
router.patch('/:id/cancel', verifyToken, cancelBooking);
router.post('/:id/pay', verifyToken, payBooking);

export default router;