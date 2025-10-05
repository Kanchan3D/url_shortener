import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: `${process.env.ORIGIN_URL}` })); // Allow frontend
console.log(process.env.ORIGIN_URL)
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('API Working'));
app.use("/", urlRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
