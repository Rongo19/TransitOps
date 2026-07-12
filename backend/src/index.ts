import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import fleetRoutes from "./routes/fleet";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "TransitOps backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api", fleetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
