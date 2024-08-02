const cron = require('node-cron');
const calculateAverageRating = require('../jobs/calculateAverageRating');


const registerCronJobs = () => {
  // Đăng ký cron job calculateAverageRating chạy mỗi ngày lúc 0:00
  // cron.schedule('0 0 * * *', calculateAverageRating);
  // console.log('Registered cron job: calculateAverageRating at 0 0 * * *');

  // cron.schedule('*/2 * * * *', calculateAverageRating);
  // console.log('Registered cron job: calculateAverageRating every 2 minutes');

  setInterval(calculateAverageRating, 10000);
  console.log('Registered cron job: calculateAverageRating every 30 seconds');

  // Đăng ký các cron job khác ở đây
};

module.exports = {
  registerCronJobs,
};
