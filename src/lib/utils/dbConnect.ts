import mongoose from 'mongoose';

const dbConnect = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Invalid/Missing environment variable MONGO_URI');
  }
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri);
};

dbConnect().catch((err) => console.log(err));

export default dbConnect;
