import mongoose from 'mongoose';

const connectDB = async () => {
  const localDB = `mongodb://127.0.0.1:27017/` + process.env.DATABASE_NAME;
  try {
    await mongoose.connect(localDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

export default connectDB;
