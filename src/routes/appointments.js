import express from "express";
import {
  createOrUpdate,
  deleteItemById,
  getTableDataByUniqueKey,
  readAllTable,
} from "../services/index.js";
import { v4 as uuid } from "uuid";

const route = express.Router();
const table = "appointments";

// GET ALL Appointments
route.get("/appointments", async (req, res) => {
  const { success, data } = await readAllTable(table);
  if (success) {
    return res.json({ success: true, data });
  }
  return res.status(500).json({ success: false, messsage: "Error" });
});

// GET ALL APPOINTMENTS BY USER
route.get("/appointments/:userId", async (req, res) => {
  const { userId } = req.params;
  const table = "appointments";
  const { success, data } = await getTableDataByUniqueKey(
    table,
    userId,
    "userId"
  );
  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

route.post("/appointment", async (req, res) => {
  const { password, ...appointmentDetails } = req.body;

  if (!appointmentDetails?.userId || !appointmentDetails?.dentistId) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid parameters." });
  }

  const newAppointment = {
    status: "Scheduled",
    ...appointmentDetails,
    appointmentId: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { success, data } = await createOrUpdate(table, newAppointment);

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

route.put("/appointment/:id", async (req, res) => {
  const appointment = req.body;
  const { id } = req.params;
  appointment.appointmentId = id;

  const { success, data } = await createOrUpdate(table, appointment);

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

route.delete("/appointment/:id", async (req, res) => {
  const { id } = req.params;
  const { success, data } = await deleteItemById(table, id, "appointmentId");
  if (success) {
    return res.json({ success, data });
  }
  return res.status(500).json({ success: false, message: "Error" });
});

export default route;
