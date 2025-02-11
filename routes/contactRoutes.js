const express = require("express");
const { saveToExcel } = require("../config/excelHandler");

const router = express.Router();

router.post("/", (req, res) => {
  const { fullName, email, phone, country, message } = req.body;

  if (!fullName || !email || !phone || !country || !message) {
    return res.status(400).json({ message: "❌ All fields are required." });
  }

  const formData = {
    Name: fullName,
    Email: email,
    Phone: phone,
    Country: country,
    Message: message,
    Timestamp: new Date().toISOString(),
  };

  console.log("🔹 Received Contact Data:", formData); // Debugging
  
  saveToExcel(formData, "Contacts");

  res.status(201).json({ message: "✅ Contact form submitted successfully!" });
});
router.get("/", (req, res) => {
  const { readFromExcel } = require("../config/excelHandler");

  try {
    const contacts = readFromExcel("Contacts");
    console.log("✅ Contacts Data Retrieved:", contacts); // Debugging
    res.json(contacts);
  } catch (error) {
    console.error("❌ Error fetching contact data:", error);
    res.status(500).json({ message: "Error fetching contact data." });
  }
});

module.exports = router;
