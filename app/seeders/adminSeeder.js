/**
 * ==========================================
 * Admin Seeder
 * ==========================================
 */

const bcrypt = require("bcryptjs");

const User = require("../models/User");

const seedAdmin = async () => {
  try {
    /**
     * CHECK EXISTING ADMIN
     */

    const existingAdmin = await User.findOne({
      role: "ADMIN",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");

      return;
    }

    /**
     * HASH PASSWORD
     */

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    /**
     * CREATE ADMIN
     */

    await User.create({
      name: process.env.ADMIN_NAME,

      email: process.env.ADMIN_EMAIL,

      password: hashedPassword,

      role: "ADMIN",

      isVerified: true,

      profileImage: {
        publicId: null,

        url: process.env.ADMIN_PROFILE_IMAGE || process.env.DEFAULT_AVATAR_URL,

        uploadedAt: new Date(),
      },
    });

    console.log("Default admin created successfully.");
  } catch (error) {
    console.error("Admin Seeder Error:", error.message);
  }
};

module.exports = seedAdmin;
