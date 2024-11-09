import { db } from "../db.config.js";
import { sendEmail } from "./mail-service.js";

// Create or Update Items
const createOrUpdate = async (table, data = {}, isUpdate = false) => {
  const params = {
    TableName: table,
    Item: data,
  };

  try {
    await db.put(params).promise();
    return { success: true };
  } catch (error) {
    console.log("CREATE METHOD ERROR", error);
    return { success: false, message: "" };
  }
};

// Read all Items
const readAllTable = async (table) => {
  const params = {
    TableName: table,
  };

  try {
    const { Items = [] } = await db.scan(params).promise();
    return { success: true, data: Items };
  } catch (error) {
    console.log("READ METHOD ERROR", error);
    return { success: false, data: null };
  }
};

// Read Items by Key
const getTableDataByUniqueKey = async (table, value, key = "ItemId") => {
  const params = {
    TableName: table,
    FilterExpression: `${key} = :key`,
    ExpressionAttributeValues: { ":key": value },
  };
  try {
    const { Items } = await db.scan(params).promise();

    return { success: true, data: Items };
  } catch (error) {
    console.log("GET BY KEY METHOD ERROR", error);
    return { success: false, data: null };
  }
};

// Delete Item by ID
const deleteItemById = async (table, value, key = "id") => {
  const params = {
    TableName: table,
    Key: {
      [key]: value,
    },
  };

  try {
    await db.delete(params).promise();
    return { success: true };
  } catch (error) {
    console.log("DELETE BY ID METHOD ERROR", error);

    return { success: false };
  }
};

const sendAppointmentEmailToUsers = async () => {
  try {
    await sendEmail();
  } catch (error) {
    console.log("SEND APPOINTMENT ERROR:", error);
    return { success: false };
  }
};

export {
  createOrUpdate,
  readAllTable,
  getTableDataByUniqueKey,
  deleteItemById,
  sendAppointmentEmailToUsers,
};
