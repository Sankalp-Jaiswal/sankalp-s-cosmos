import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-cosmos';
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}
