// server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(__dirname));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up storage engine for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Connect to SQLite database
const db = new sqlite3.Database('appointments.db');

// Create appointments table if not exists
db.run(`CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  symptoms TEXT,
  appointment_time TEXT,          
  report_path TEXT
)`);

// Handle appointment form submission
app.post('/appointment', upload.single('report'), (req, res) => {
  const { name, email, phone, symptoms, appointment_time } = req.body;
  const reportPath = req.file ? req.file.path : '';

  db.run(
    `INSERT INTO appointments (name, email, phone, symptoms, appointment_time, report_path)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, phone, symptoms, appointment_time, reportPath],
    function(err) {
      if (err) {
        return res.status(500).send('Database error: ' + err.message);
      }
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Appointment Confirmed</title>
          <style>
            body {
              margin: 0;
              font-family: 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #89f7fe, #66a6ff);
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .success-box {
              background: white;
              padding: 3rem;
              border-radius: 15px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 500px;
            }
            .tick {
              font-size: 4rem;
              color: #28a745;
            }
            h2 {
              color: #333;
              margin-top: 1rem;
            }
            a {
              display: inline-block;
              margin-top: 1.5rem;
              padding: 0.7rem 1.2rem;
              background-color: #66a6ff;
              color: white;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
            }
            a:hover {
              background-color: #4f90e3;
            }
          </style>
        </head>
        <body>
          <div class="success-box">
            <div class="tick">✅</div>
            <h2>Appointment Booked Successfully!</h2>
            <a href="/">Back to Form</a>
          </div>
        </body>
        </html>
      `);
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/appointments', (req, res) => {
  db.all('SELECT * FROM appointments ORDER BY appointment_time DESC', [], (err, rows) => {
    if (err) return res.status(500).send('Error retrieving appointments.');

    let tableRows = rows.map(row => `
      <tr>
        <td>${row.id}</td>
        <td contenteditable="true" data-field="name" data-id="${row.id}">${row.name}</td>
        <td contenteditable="true" data-field="email" data-id="${row.id}">${row.email}</td>
        <td contenteditable="true" data-field="phone" data-id="${row.id}">${row.phone}</td>
        <td contenteditable="true" data-field="symptoms" data-id="${row.id}">${row.symptoms}</td>
        <td contenteditable="true" data-field="appointment_time" data-id="${row.id}">${row.appointment_time}</td>
        <td>${row.report_path}</td>
        <td><button onclick="deleteAppointment(${row.id})">❌</button></td>
      </tr>`).join('');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Appointments</title>
        <style>
          body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #89f7fe, #66a6ff);
            padding: 2rem;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 2rem;
            background: white;
            border-radius: 10px;
            overflow: hidden;
          }
          th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #ccc;
          }
          th {
            background-color: #66a6ff;
            color: white;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
          td[contenteditable] {
            background-color: #eef;
          }
          button {
            background-color: red;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>All Appointments</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Symptoms</th>
              <th>Time</th>
              <th>Report</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <script>
          document.querySelectorAll('[contenteditable]').forEach(cell => {
            cell.addEventListener('blur', () => {
              const id = cell.getAttribute('data-id');
              const field = cell.getAttribute('data-field');
              const value = cell.innerText;

              fetch('/appointments/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ field, value })
              });
            });
          });

          function deleteAppointment(id) {
            fetch('/appointments/' + id, {
              method: 'DELETE'
            }).then(() => location.reload());
          }
        </script>
      </body>
      </html>
    `);
  });
});
app.delete('/appointments/:id', (req, res) => {
  db.run('DELETE FROM appointments WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).send('Delete failed.');
    res.sendStatus(200);
  });
});

app.put('/appointments/:id', (req, res) => {
  const { field, value } = req.body;
  const query = `UPDATE appointments SET ${field} = ? WHERE id = ?`;
  db.run(query, [value, req.params.id], err => {
    if (err) return res.status(500).send('Update failed.');
    res.sendStatus(200);
  });
});
