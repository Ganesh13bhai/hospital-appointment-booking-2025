CREATE TABLE IF NOT EXISTS users(

id INTEGER PRIMARY KEY AUTOINCREMENT,

username TEXT UNIQUE,

password TEXT,

role TEXT

);



CREATE TABLE IF NOT EXISTS doctors(

id INTEGER PRIMARY KEY AUTOINCREMENT,

name TEXT,

specialization TEXT,

experience INTEGER,

fees INTEGER,

availability TEXT

);



CREATE TABLE IF NOT EXISTS appointments(

id INTEGER PRIMARY KEY AUTOINCREMENT,


patient_name TEXT,


email TEXT,


phone TEXT,


doctor_id INTEGER,


symptoms TEXT,


appointment_time TEXT,


status TEXT DEFAULT 'Pending',


report_path TEXT,


FOREIGN KEY(doctor_id)

REFERENCES doctors(id)

);