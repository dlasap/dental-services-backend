import express from "express";
import {
  createOrUpdate,
  deleteItemById,
  getTableDataByUniqueKey,
  readAllTable,
} from "../services/index.js";
import { v4 as uuid } from "uuid";
import { hashPassword } from "../utils/helper.js";

const route = express.Router();
const table = "users";

// READ ALL Users
route.get("/users", async (req, res) => {
  const { success, data } = await readAllTable(table);

  if (success) {
    return res.json({ success: true, data });
  }
  return res.status(500).json({ success: false, messsage: "Error" });
});

// Get User by ID
route.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { success, data } = await getUserById(id);
  console.log(data);
  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

// Create User
route.post("/user", async (req, res) => {
  const { password, ...userDetails } = req.body;

  if (!userDetails?.email || !userDetails?.password) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid parameters." });
  }

  const { data: existingUser } = await getTableDataByUniqueKey(
    table,
    userDetails?.email,
    "email"
  );

  console.log({ existingUser });

  if (existingUser.length > 0) {
    return res
      .status(409)
      .json({ success: false, message: "Can't create user." });
  }

  const newUser = {
    ...userDetails,
    userId: uuid(),
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    passwordHash: await hashPassword(password),
  };

  const { success, data } = await createOrUpdate(table, newUser);

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

// Update User by ID
route.put("/user/:id", async (req, res) => {
  const user = req.body;
  const { id } = req.params;
  user.id = parseInt(id);

  const { success, data } = await createOrUpdate(table, user);

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

// Delete User by Id
route.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { success, data } = await deleteItemById(id);
  if (success) {
    return res.json({ success, data });
  }
  return res.status(500).json({ success: false, message: "Error" });
});

export default route;
