import { timeStamp } from 'console';
import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, 

        receiver: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: true,
        }, 

        text: {
            type: String,
            required: true, 
        },

        createdAt: {
            type: Date, 
            required: true, 
            default: Date.now
        }
    }
);

export default model<IMessage>('Message', messageSchema);
