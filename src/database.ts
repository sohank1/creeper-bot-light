import mongoose from 'mongoose';

export default mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } as any);