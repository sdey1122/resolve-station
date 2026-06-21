/**
 * ==========================================
 * ResolveStation Application
 * ==========================================
 */

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

/**
 * ==========================================
 * INTERNAL IMPORTS
 * ==========================================
 */

const connectDB = require("./app/config/db");
const startCronJobs = require("./app/cron");

const notFoundMiddleware = require("./app/middlewares/notFoundMiddleware");

const errorMiddleware = require("./app/middlewares/errorMiddleware");

/**
 * ==========================================
 * API ROUTES
 * ==========================================
 */

const authApiRoutes = require("./app/routes/backend-routes/authApiRoutes");

const adminApiRoutes = require("./app/routes/backend-routes/adminApiRoutes");

const profileApiRoutes = require("./app/routes/backend-routes/profileApiRoutes");

/**
 * ==========================================
 * FRONTEND ROUTES
 * ==========================================
 */

const publicRoutes = require("./app/routes/frontend-routes/publicRoutes");

const authRoutes = require("./app/routes/frontend-routes/authRoutes");

const adminRoutes = require("./app/routes/frontend-routes/adminRoutes");

const staffRoutes = require("./app/routes/frontend-routes/staffRoutes");

const residentRoutes = require("./app/routes/frontend-routes/residentRoutes");

const app = express();

const seedAdmin = require("./app/seeders/adminSeeder");

/**
 * ==========================================
 * DATABASE
 * ==========================================
 */

connectDB();

seedAdmin();

/**
 * ==========================================
 * CRON JOBS
 * ==========================================
 */

startCronJobs();

/**
 * ==========================================
 * VIEW ENGINE
 * ==========================================
 */

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

/**
 * ==========================================
 * SECURITY
 * ==========================================
 */

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:5131", "http://localhost:3000"],

    credentials: true,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com",
        ],

        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com",
          "https:",
        ],

        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net",
        ],

        connectSrc: [
          "'self'",
          "https://res.cloudinary.com",
          "https://cdn.jsdelivr.net",
        ],

        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://maps.google.com",
        ],
      },
    },
  }),
);

/**
 * ==========================================
 * BODY PARSERS
 * ==========================================
 */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

/**
 * ==========================================
 * STATIC FILES
 * ==========================================
 */

app.use(express.static(path.join(__dirname, "public")));

/**
 * ==========================================
 * FRONTEND ROUTES
 * ==========================================
 */

app.use("/", publicRoutes);

app.use("/auth", authRoutes);

app.use("/admin", adminRoutes);

app.use("/staff", staffRoutes);

app.use("/resident", residentRoutes);

/**
 * ==========================================
 * API ROUTES
 * ==========================================
 */

app.use("/api/auth", authApiRoutes);

app.use("/api/admin", adminApiRoutes);

app.use("/api/profile", profileApiRoutes);

/*
|--------------------------------------------------------------------------
| ENABLE LATER
|--------------------------------------------------------------------------
|
| Uncomment when these files are built.
|
*/

// app.use("/api/staff", staffApiRoutes);

// app.use("/api/resident", residentApiRoutes);

/**
 * ==========================================
 * ERROR HANDLING
 * ==========================================
 */

app.use(notFoundMiddleware);

app.use(errorMiddleware);

/**
 * ==========================================
 * SERVER
 * ==========================================
 */

const PORT = process.env.PORT || 5131;

app.listen(PORT, () => {
  console.log(`ResolveStation running at http://localhost:${PORT}`);
});
