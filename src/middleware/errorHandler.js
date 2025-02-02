const mongoose = require('mongoose');
const { MongoError } = require('mongodb');
const RedisError = require('ioredis').RedisError;

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof mongoose.Error) {
    return res.status(400).json({
      success: false,
      message: 'Mongoose Error: ' + err.message,
    });
  } else if (err instanceof MongoError) {
    return res.status(500).json({
      success: false,
      message: 'MongoDB Error: ' + err.message,
    });
  } else if (err instanceof RedisError) {
    return res.status(500).json({
      success: false,
      message: 'Redis Error: ' + err.message,
    });
  } else {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
};

module.exports = errorHandler;
