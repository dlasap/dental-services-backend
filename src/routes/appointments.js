import express from "express";
import {
  createOrUpdate,
  deleteItemById,
  getTableDataByUniqueKey,
  readAllTable,
  sendAppointmentEmailToUsers,
} from "../services/index.js";
import { v4 as uuid } from "uuid";
import { getFormattedDate, getFormattedTime } from "../utils/helper.js";

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

  const {
    data: [possibleUser],
    success: isGetUserSuccess,
  } = await getTableDataByUniqueKey(
    "users",
    appointmentDetails.userId,
    "userId"
  );

  const {
    data: [possibleDentist],
    success: isGetDentistSuccess,
  } = await getTableDataByUniqueKey(
    "dentists",
    appointmentDetails.dentistId,
    "dentistId"
  );

  if (possibleUser && possibleDentist) {
    sendAppointmentEmailToUsers({
      subject: "Appointment confirmed at Dom's Dental",
      to: possibleUser?.email ?? "lasapdominic@gmail.com",
      emailHTMLContentString: `
    <div>
        <h3 style="color:#03b6fc;">Greetings from Dom's Dental Clinic </h3>
        </br>
        <p style="font-size: 1.2rem;">Hi <strong>${
          possibleUser?.firstName
        }</strong>!</p>
        
        </br>
        
        <p style="font-size:0.85rem;">This email serves as your confirmation email for your appointment with <strong>${
          possibleDentist?.fullName
        }</strong> on <strong>${getFormattedDate(
        appointmentDetails?.appointmentDate
      )}</strong> at <strong>${getFormattedTime(
        appointmentDetails?.appointmentTime
      )}.</strong> </p>
        </br>
        <p style="font-size:0.85rem;"> Please come 15 minutes before your appointed time. </p>
        </br>
        <p style="font-size:0.85rem;">See you!</p>
        </br>
        <div style='margin-top:1.5rem;'>
            <p style="font-size:0.8rem; font-weight:700;">Dom's Dental</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">+63 905 5610116</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">Building 456, State</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">XYZ City, Cebu, Philippines</p>
        </div>
    </div>
    `,
    });
  }

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

route.put("/appointment/:id", async (req, res) => {
  const appointment = req.body;
  const { id } = req.params;

  appointment.appointmentId = id;
  appointment.updatedAt = new Date().toISOString();

  const { success, data } = await createOrUpdate(table, appointment);

  const {
    data: [possibleUser],
    success: isGetUserSuccess,
  } = await getTableDataByUniqueKey("users", appointment.userId, "userId");

  const {
    data: [possibleDentist],
    success: isGetDentistSuccess,
  } = await getTableDataByUniqueKey(
    "dentists",
    appointment.dentistId,
    "dentistId"
  );

  if (possibleUser && possibleDentist) {
    sendAppointmentEmailToUsers({
      subject: "Appointment Rescheduled at Dom's Dental",
      to: possibleUser?.email ?? "lasapdominic@gmail.com",
      emailHTMLContentString: `
    <div>
        <h3 style="color:#03b6fc;">Greetings from Dom's Dental Clinic </h3>
        </br>
        <p style="font-size: 1.2rem;">Hi <strong>${
          possibleUser?.firstName
        }</strong>!</p>
        
        </br>
        
        <p style="font-size:0.85rem;">Your appointment with <strong>${
          possibleDentist?.fullName
        }</strong> has been rescheduled to <strong>${getFormattedDate(
        appointment?.appointmentDate
      )}</strong> at <strong>${getFormattedTime(
        appointment?.appointmentTime
      )}.</strong></p>
        </br>
        <p style="font-size:0.85rem;"> Please come 15 minutes before your appointed time. </p>
        </br>
        <p style="font-size:0.85rem;">See you!</p>
        </br>
        <div style='margin-top:1.5rem;'>
            <p style="font-size:0.8rem; font-weight:700;">Dom's Dental</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">+63 905 5610116</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">Building 456, State</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">XYZ City, Cebu, Philippines</p>
        </div>
    </div>
    `,
    });
  }

  if (success) {
    return res.json({ success, data });
  }

  return res.status(500).json({ success: false, message: "Error" });
});

route.delete("/appointment/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Please check your parameters",
    });
  }

  const {
    data: [possibleAppointment],
    success: isGetAppointmentSuccess,
  } = await getTableDataByUniqueKey("appointments", id, "appointmentId");

  if (!possibleAppointment) {
    return res.status(404).json({
      success: false,
      message: "Appointment not found",
    });
  }

  const { success, data } = await deleteItemById(table, id, "appointmentId");

  const {
    data: [possibleUser],
    success: isGetUserSuccess,
  } = await getTableDataByUniqueKey(
    "users",
    possibleAppointment.userId,
    "userId"
  );

  const {
    data: [possibleDentist],
    success: isGetDentistSuccess,
  } = await getTableDataByUniqueKey(
    "dentists",
    possibleAppointment.dentistId,
    "dentistId"
  );

  if (possibleUser && possibleDentist) {
    sendAppointmentEmailToUsers({
      subject: "Appointment Cancelled at Dom's Dental",
      to: possibleUser?.email ?? "lasapdominic@gmail.com",
      emailHTMLContentString: `
    <div>
        <h3 style="color:#03b6fc;">Greetings from Dom's Dental Clinic </h3>
        </br>
        <p style="font-size: 1.2rem;">Hi <strong>${
          possibleUser?.firstName
        }</strong>!</p>
        
        </br>
        
        <p style="font-size:0.85rem;">Your appointment with <strong>${
          possibleDentist?.fullName
        }</strong> on <strong>${getFormattedDate(
        possibleAppointment?.appointmentDate
      )}</strong> at <strong>${getFormattedTime(
        possibleAppointment?.appointmentTime
      )}.</strong> has been cancelled successfully.</p>
        </br>
        <div style='margin-top:1.5rem;'>
            <p style="font-size:0.8rem; font-weight:700;">Dom's Dental</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">+63 905 5610116</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">Building 456, State</p>
            <p style="font-size:0.65rem; padding: 0px; margin: 1px;">XYZ City, Cebu, Philippines</p>
        </div>
    </div>
    `,
    });
  }

  if (success) {
    return res.json({ success, data });
  }
  return res.status(500).json({ success: false, message: "Error" });
});

export default route;
