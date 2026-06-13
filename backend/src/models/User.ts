import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'guest' | 'host' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}


const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
        password: { type: String, required: true},

    role: { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' },
}, { timestamps: true });


UserSchema.pre<IUser>('save', async function () {
    
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: any) {
       
        throw error;
    }
});

export default mongoose.model<IUser>('User', UserSchema);

