# 🏢 ResolveStation

A modern Apartment & Resident Management System built with **Node.js**, **Express.js**, **MongoDB**, **JWT Authentication**, and **Cloudinary**.

ResolveStation provides secure user authentication, staff management, resident management, profile handling, audit logging, and role-based access control.

---

## 🚀 Features

### 🔐 Authentication

* User Registration
* Email Verification
* Login / Logout
* Refresh Token Authentication
* Forgot Password
* Reset Password
* Secure Password Hashing (bcrypt)

### 👤 Profile Management

* Upload Profile Image
* Replace Existing Profile Image
* Delete Profile Image
* Cloudinary Integration
* Default Avatar Support
* Change Password

### 🛡 Security

* JWT Authentication
* Refresh Token System
* Role-Based Authorization
* Account Verification
* Account Locking After Multiple Failed Logins
* Secure HTTP-Only Cookies

### 👨‍💼 Admin Features

* Create Staff Accounts
* View Staff Members
* Soft Delete Staff
* Restore Staff
* Permanently Delete Staff
* Staff Login Tracking

### 📋 Audit Logging

* Staff Creation Logs
* Staff Deletion Logs
* Staff Restoration Logs
* Password Change Logs
* Profile Image Update Logs
* Profile Image Delete Logs

### ☁️ Cloudinary Integration

* Image Upload
* Image Replacement
* Automatic Image Cleanup
* Default Avatar Fallback

### 📊 Tracking

* Last Login Date
* Last Login IP Address
* Audit History

---

## 🛠 Tech Stack

| Technology    | Usage                 |
| ------------- | --------------------- |
| Node.js       | Runtime               |
| Express.js    | Backend Framework     |
| MongoDB       | Database              |
| Mongoose      | ODM                   |
| JWT           | Authentication        |
| bcryptjs      | Password Hashing      |
| Cloudinary    | Image Storage         |
| Multer        | File Uploads          |
| Nodemailer    | Email Service         |
| Joi           | Validation            |
| Cookie Parser | Cookie Handling       |
| Helmet        | Security Headers      |
| CORS          | Cross-Origin Requests |

---

## 📂 Project Structure

```bash
app
├── config
├── controllers
├── cron
├── middlewares
├── models
├── routes
├── seeders
├── services
├── utils
├── validations
└── views

public
views
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=5131

NODE_ENV=development

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

REFRESH_TOKEN_SECRET=your_refresh_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

DEFAULT_AVATAR_URL=your_default_avatar
```

---

## 🚦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/resolve-station.git
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

---

## 🔑 Default Admin

Admin account is automatically seeded on first startup.

```text
Email: admin@resolvestation.com
Password: ********
```

Configure credentials through environment variables.

---

## 📌 Current Status

### Completed

* Authentication System
* Staff Management
* Profile Management
* Audit Logging
* Cloudinary Integration
* Login Tracking

### In Progress

* EJS Dashboard UI
* Resident Management Module
* Apartment Management Module

---

## 👨‍💻 Author

Built by Subhankar Dey

Backend Developer | MERN Stack Developer

---

## 📄 License

This project is developed for educational and portfolio purposes.
