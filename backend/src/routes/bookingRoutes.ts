import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
import { 
  createBooking, 
  getMyBookings, 
  getHostBookings,
  getBookingById, 
  cancelBooking 
} from '../controllers/BookingController';

const router = express.Router();

//Protect all endpoints globally inside this routing module
router.use(verifyToken);

router.route('/').post(createBooking);
router.route('/my-bookings').get(getMyBookings);
router.route('/host').get(checkRole(['host', 'admin']), getHostBookings);
router.route('/:id').get(getBookingById);
router.route('/:id/cancel').patch(cancelBooking);

export default router;