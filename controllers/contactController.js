const { saveToExcel } = require("../config/excelHandler");

const submitContactForm = (req, res) => {
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

  saveToExcel(formData);
  res.json({ message: "✅ Form submitted successfully!" });
};

module.exports = { submitContactForm };
