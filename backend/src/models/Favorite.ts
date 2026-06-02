import { Schema, model, Document } from 'mongoose';

export interface IFavorite extends Document {
    userId: Schema.Types.ObjectId;
    propertyId: Schema.Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
    {
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, 

        propertyId:{
            type: Schema.Types.ObjectId, 
            ref: 'Property',
            required: true,
        }
    }, 

    {timestamps: true}
);

favoriteSchema.index({userId: 1, propertyId: 1}, {unique:true});

export default model<IFavorite>('Favorite', favoriteSchema);
