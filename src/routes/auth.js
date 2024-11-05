const route = express.Router();
import express from "express";
import jwt from "jsonwebtoken";
import { createOrUpdate, getTableDataByUniqueKey } from "../services/index.js";
import { v4 as uuid } from "uuid";
import { hashPassword, passwordVerifier } from "../utils/helper.js";

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    const table = "users";

    if (!email || !password) {
      return res.status(409).json({
        success: false,
        message: "Invalid Parameters.",
      });
    }

    const {
      data: [possibleUser],
      success,
    } = await getTableDataByUniqueKey(table, email, "email");
    console.log("possibleUser", possibleUser);

    if (!possibleUser) {
      return res
        .status(409)
        .json({ success: false, message: "No existing user." });
    }

    const isPasswordVerified = await passwordVerifier(
      password,
      possibleUser.passwordHash
    );

    if (!isPasswordVerified) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }
    const token = jwt.sign(
      { userId: possibleUser.userId, role: possibleUser.role ?? "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    res.status(200).json({
      success,
      token,
      data: {
        firstName: possibleUser?.firstName,
        lastName: possibleUser?.lastName,
        userId: possibleUser?.userId,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

route.post("/register", async (req, res) => {
  const { password, ...userDetails } = req.body;
  const table = "users";
  if (!userDetails?.email || !password) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid parameters." });
  }

  const { data: existingUser } = await getTableDataByUniqueKey(
    table,
    userDetails?.email,
    "email"
  );

  if (existingUser.length > 0) {
    return res
      .status(409)
      .json({ success: false, message: "Can't create user." });
  }

  const newUser = {
    ...userDetails,
    userId: uuid(),
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

route.post("/existingUser", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Invalid Parameters",
      });
    }

    const { data, success } = await getTableDataByUniqueKey(
      "users",
      email,
      "email"
    );

    let userEmail = null;

    if (data?.[0]) {
      const { email } = data?.[0];
      userEmail = email;
    }
    return res.status(200).json({
      success,
      data: userEmail,
    });
  } catch (error) {
    console.error("GET USER ERROR", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default route;
