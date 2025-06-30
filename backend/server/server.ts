import cors from 'cors';
import dotenv from 'dotenv';
import { App } from './app'; 
import { connectDB } from '../config/connectmongo';

dotenv.config();

const PORT = process.env.PORT || 3000;

const appInstance = new App();
const app = appInstance.app;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
