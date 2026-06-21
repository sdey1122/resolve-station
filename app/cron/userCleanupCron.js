/**
 * ==========================================
 * User Cleanup Cron
 * Permanently delete users after 30 days
 * ==========================================
 */

const cron = require("node-cron");

const userCleanupCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running user cleanup cron...");
    } catch (error) {
      console.error("User cleanup cron failed:", error.message);
    }
  });
};

module.exports = userCleanupCron;
