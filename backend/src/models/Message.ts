import { timeStamp } from 'console';
import { Schema, model, Document } from 'mongoose';

export type MessageType = 'text' | 'listing_deleted';

export interface IMessage extends Document {
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    text: string;
    type: MessageType;
    listingId?: string;
    listingTitle?: string;
    deletionReason?: string;
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

        type: {
            type: String,
            enum: ['text', 'listing_deleted'],
            default: 'text',
        },

        listingId: {
            type: String,
            required: false,
        },

        listingTitle: {
            type: String,
            required: false,
        },

        deletionReason: {
            type: String,
            required: false,
        },

        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
);

export default model<IMessage>('Message', messageSchema);
