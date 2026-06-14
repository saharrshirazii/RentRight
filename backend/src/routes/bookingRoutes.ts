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

//Protect all endpoints globally inside this routing module
router.use(verifyToken);

router.route('/').post(createBooking);
router.route('/my-bookings').get(getMyBookings);
router.route('/host').get(getHostBookings);
router.route('/:id').get(getBookingById);
router.route('/:id/cancel').patch(cancelBooking);

router.post("/:id/pay", verifyToken, payBooking);

export default router;