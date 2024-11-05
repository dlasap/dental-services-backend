import express from "express";
import {
  createOrUpdate,
  deleteItemById,
  getTableDataByUniqueKey,
  readAllTable,
} from "../services/index.js";
import { v4 as uuid } from "uuid";

const route = express.Router();
const table = "dentists";

// READ ALL Dentists
route.get("/dentists", async (req, res) => {
  const { success, data } = await readAllTable(table);

  if (success) {
    return res.json({ success: true, data });
  }
  return res.status(500).json({ success: false, messsage: "Error" });
});

// Get Dentists by ID
route.get("/dentist/:id", async (req, res) => {
  const { id } = req.params;
  const { success, data } = await getDentistsById(id);
  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

// Create Dentists
route.post("/dentist", async (req, res) => {
  const { password, ...dentistDetails } = req.body;

  if (!dentistDetails?.fullName || !dentistDetails?.email) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid parameters." });
  }

  const { data: existingDentist } = await getTableDataByUniqueKey(
    table,
    dentistDetails?.email,
    "email"
  );

  if (existingDentist.length > 0) {
    return res
      .status(409)
      .json({ success: false, message: "Can't create dentist." });
  }

  const newDentist = {
    ...dentistDetails,
    dentistId: uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const { success, data } = await createOrUpdate(table, newDentist);

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

// Update dentist by ID
route.put("/dentist/:id", async (req, res) => {
  const dentist = req.body;
  const { id } = req.params;
  dentist.dentistId = id;

  const { success, data } = await createOrUpdate(table, dentist, true);

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

// Delete Dentists by Id
route.delete("/dentist/:id", async (req, res) => {
  const { id } = req.params;
  const { success, data } = await deleteItemById(id);
  if (success) {
    return res.json({ success, data });
  }
  return res.status(500).json({ success: false, message: "Error" });
});

export default route;
