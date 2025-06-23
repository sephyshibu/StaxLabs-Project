import cors from 'cors';
import dotenv from 'dotenv';
import { App } from './app'; // Adjust this path if needed
import { connectDB } from '../config/connectmongo';

dotenv.config();

const PORT = process.env.PORT || 3000;

// ✅ Initialize Express app
const appInstance = new App();
const app = appInstance.app;

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// ✅ Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
