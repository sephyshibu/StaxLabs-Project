import mongoose from 'mongoose';
import { IUser } from '../../domain/model/IUser';


const userSchema = new mongoose.Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'vendor', 'customer'] },
});
export const UserModel= mongoose.model<IUser>('User', userSchema);
