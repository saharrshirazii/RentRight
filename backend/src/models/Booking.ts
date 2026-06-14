import mongoose , {Schema , Document} from 'mongoose';

export interface IBooking extends Document {
    propertyId: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema (
{
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: [true , 'En bokning måste vara kopplad till ett boende.'],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true , 'En bokning måste ha en tillhörande gäst.'],
    },
    startDate: {
        type: Date,
        required: [true , 'Vänligen ange ett incheckningsdatum.'],
    },
    endDate: {
         type: Date,
        required: [true , 'Vänligen ange ett utcheckningsdatum.'],
    },
    totalPrice: {
        type: Number,
        required: [true , 'Totalpris måste beräknas.'],
    },
    status: {
        type: String,
        enum: ['pending' , 'confirmed' , 'canceled'],
        default: 'confirmed',
    },
},
{
    timestamps: true, 
  }
);


BookingSchema.index({ propertyId: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);