import bcrypt from "bcrypt";

// Function to hash a password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function passwordVerifier(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
}

export function getFormattedDate(dateString) {
  if (!dateString) return;
  // Create a Date object from the date string
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date)) {
    throw new Error("Invalid date string");
  }

  // Format the date to "Day, Month Date, Year"
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}

export function getFormattedTime(timeString) {
  if (!timeString) return;
  // Create a Date object with today's date and the given time
  const [hours, minutes] = timeString?.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  // Format the time to "h:mm AM/PM"
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedTime;
}

// To be finalized
export async function emailTemplateBuilder({ to, from, subject }) {
  return `
    <div>
          <h3>${subject}</h3>
    </div>
  `;
}
