import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();
const app = express();

// CORS configuration for deployment
const allowedOrigins = process.env.ORIGIN_URL 
  ? process.env.ORIGIN_URL.split(',') 
  : ['http://localhost:5173'];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));

console.log('Allowed origins:', allowedOrigins);
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('API Working'));
app.use("/", urlRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
