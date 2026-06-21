/**
 * ==========================================
 * Register All Cron Jobs
 * ==========================================
 */

const userCleanupCron = require("./userCleanupCron");

const startCronJobs = () => {
  userCleanupCron();
};

module.exports = startCronJobs;
