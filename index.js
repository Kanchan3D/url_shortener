import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: `${process.env.ORIGIN_URL}` })); // Allow frontend

connectDB();

app.use("/", urlRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
