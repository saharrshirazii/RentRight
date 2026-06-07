import { Schema, model, Document, Types } from 'mongoose';

export interface IAdminLog extends Document {
  adminId: Types.ObjectId;
  action: 'DELETE_LISTING' | 'APPROVE_LISTING' | 'REVISION_REQUEST' | 'REJECT_LISTING' | 'RESUBMIT_LISTING';
  targetId: Types.ObjectId;
  reason: string;
  timestamp: Date;
}

const adminLogSchema = new Schema<IAdminLog>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // Ta bort default: 'DELETE_LISTING'
  targetId: { type: Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const AdminLog = model<IAdminLog>('AdminLog', adminLogSchema);