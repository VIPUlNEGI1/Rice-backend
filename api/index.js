const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const EXCEL_FILE = path.join(__dirname, "form_submissions.xlsx");

// Function to Read Data from Excel
const readFromExcel = (sheetName) => {
  try {
    if (!fs.existsSync(EXCEL_FILE)) return [];

    const workbook = xlsx.readFile(EXCEL_FILE);
    const worksheet = workbook.Sheets[sheetName];
    return worksheet ? xlsx.utils.sheet_to_json(worksheet) : [];
  } catch (error) {
    console.error(`❌ Error reading from Excel [${sheetName}]:`, error);
    return [];
  }
};

// Function to Save Data to Excel
const saveToExcel = (data, sheetName) => {
  try {
    let workbook;
    let worksheet;

    if (fs.existsSync(EXCEL_FILE)) {
      workbook = xlsx.readFile(EXCEL_FILE);
      worksheet = workbook.Sheets[sheetName] || xlsx.utils.aoa_to_sheet([]);
    } else {
      workbook = xlsx.utils.book_new();
      worksheet = xlsx.utils.aoa_to_sheet([]);
    }

    let jsonData = xlsx.utils.sheet_to_json(worksheet);
    jsonData.push(data);

    const newWorksheet = xlsx.utils.json_to_sheet(jsonData);
    workbook.Sheets[sheetName] = newWorksheet;
    xlsx.writeFile(workbook, EXCEL_FILE);

    console.log(`✅ Data saved to "${sheetName}" successfully!`);
  } catch (error) {
    console.error("❌ Error saving to Excel:", error);
  }
};
// root api 
app.get("/",(req,res) => {
  res.status(201).json({res:"success"})
});
// Save Inquiry Form Data
app.post("/api/inquiry", (req, res) => {
  console.log("🔹 Inquiry Data Received:", req.body); // Debugging
  saveToExcel(req.body, "Inquiries");
  res.status(201).json({ message: "✅ Inquiry submitted successfully!" });
});

// Save Contact Form Data
app.post("/api/contact", (req, res) => {
  console.log("🔹 Contact Data Received:", req.body); // Debugging

  if (!req.body.fullName || !req.body.email || !req.body.phone || !req.body.country || !req.body.message) {
    return res.status(400).json({ error: "❌ All fields are required!" });
  }

  saveToExcel(req.body, "Contacts");
  res.status(201).json({ message: "✅ Contact form submitted successfully!" });
});

// Get Inquiries Data
app.get("/api/inquiries", (req, res) => {
  const data = readFromExcel("Inquiries");
  res.json(data);
});

//root api
app.get('/',(req,res) => {
  res.json("server running successfully");
})

// Get Contacts Data
app.get("/api/contacts", (req, res) => {
  const data = readFromExcel("Contacts");
  res.json(data);
});

// Download Excel File
app.get("/api/download", (req, res) => {
  if (fs.existsSync(EXCEL_FILE)) {
    res.download(EXCEL_FILE, "FormSubmissions.xlsx");
  } else {
    res.status(404).json({ error: "No file available!" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
