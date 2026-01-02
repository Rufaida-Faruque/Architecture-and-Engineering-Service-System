

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['sp', 'cl', 'adm'],  // Allowed roles: sp (service provider), cl (client), adm (admin)
    required: true,
  },
});

// Make sure to use export default for the model
const User = mongoose.model('User', userSchema);
export default User;  // Default export

