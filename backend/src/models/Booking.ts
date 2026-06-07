import mongoose , {Schema , Document} from 'mongoose';

export interface IBooking extends Document {
    PropertyId : mongoose.Types.ObjectId | string;
    userId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: 'Pending' | 'confirmed' | 'canceled';
    createAt: Date;
}

const BookingSchema: Schema = new Schema (
{
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: [true , 'En bokning måste vara kopplad till ett boende.'],
    },
    userId: {
        type: String,
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

// Indexing for high performance
// This speeds up our date-overlap checks significantly when searching!
BookingSchema.index({ propertyId: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);