import express from "express";
import dotenv from "dotenv";
import users from "./routes/users.js";
import dentists from "./routes/dentists.js";
import appointments from "./routes/appointments.js";
import verifyToken from "./middleware/verify-token-middleware.js";
import auth from "./routes/auth.js";
import cors from "cors";
import verifyAdmin from "./middleware/verify-admin.js";
import { sendAppointmentEmailToUsers } from "./services/index.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
    process.env.AWS_DEPLOYED_FRONTEND_URL ?? "",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  sendAppointmentEmailToUsers();
  res.json({
    message: "Welcome to Dom's Dental.",
  });
});

app.use(auth);

app.use("/admin", verifyAdmin, users);
app.use("/api", verifyToken, dentists, appointments);

app.get("*", (_, res) => {
  res.status(404).send("404 | Not found!");
});

app.listen(PORT, () => {
  console.log(`Port listening on ${PORT}`);
});
