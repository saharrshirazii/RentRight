import { Schema, model, Document, Types } from 'mongoose';

export interface IFavorite extends Document {
    userId: Types.ObjectId;
    propertyId: Types.ObjectId;
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
            ref: 'Listning',
            required: false,
        }
    }, 

    {timestamps: true}
);

favoriteSchema.index({userId: 1, propertyId: 1}, {unique:true});

export default model<IFavorite>('Favorite', favoriteSchema);
