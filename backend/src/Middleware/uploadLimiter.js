const rateLimit = require('express-rate-limit');
const uploadLimiter = rateLimit({
    windowMs: 1 * 1000, // 1 phút
    max: 1, // tối đa 5 lần upload mỗi phút cho mỗi IP
    message: 'Quá nhiều lần upload trong thời gian ngắn. Vui lòng thử lại sau.',
    handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: '!! Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.'
    });
  }
});

module.exports = uploadLimiter;