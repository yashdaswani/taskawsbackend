// src/lambda.js
const AWS = require('aws-sdk');
require('dotenv').config();

const lambda = new AWS.Lambda({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

module.exports = lambda;
