import * as mongoose from 'mongoose';

export const userSchema:mongoose.Schema = new mongoose.Schema({
  password: {
      type: String,
      required: true,
      match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
      minlength: 6
  },
  email: {
      type: String,
      require: true,
      match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  admin: {
     type: Boolean,
     required: false,
     default: false
  },
  created: {
     type: Date,
     required: true,
     default: new Date()
  }
});

userSchema.pre('save', (next)=> {

	next();
});

export interface IUserModel extends mongoose.Document {
  password: string,
  email:string,
  admin: boolean
  created: Date,
}
