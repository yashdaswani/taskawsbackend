// taskRoutes.js
const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const router = express.Router();
const uuid = require('uuid');

// Define your AWS API Gateway URL and API Key
const AWS_API_URL = 'https://83h96r706m.execute-api.ap-south-1.amazonaws.com/Dev'; 

router.get('/', async (req, res, next) => {
    try {
      // Extract the token from the request headers
      const token = req.headers.token;
  
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
  
      // Decode the token to get the user ID
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
      const userId = decodedToken.userId;
  
      // Make the request to the AWS API Gateway with the user ID
      const response = await axios.get(`${AWS_API_URL}?userId=${userId}`, {
        headers: { token: req.headers.token },
      });
      
      res.json(response.data);
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const token = req.headers.token;
      console.log(token)
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
  
      // Decode the token to get the user ID
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const _userId = decodedToken.userId;
      console.log(_userId)
      // Generate a unique taskId using uuid
      const _taskId = uuid.v4();
      console.log(_taskId)
      if (!req.body.description || !req.body.title) {
        return res.status(400).json({ message: 'Missing required parameters in the request body' });
      }
  
      // Include userId and taskId in the request body
      const requestBody = {
        userId: _userId,
        taskId: _taskId,
        description: req.body.description,
        title: req.body.title,
        dueDate: req.body.dueDate,
      };
  
      const response = await axios.post(AWS_API_URL, requestBody);
  
      res.status(201).json(response.data);
    } catch (error) {
      next(error);
    }
  });

  router.put('/:taskId', async (req, res, next) => {
    try {
      const token = req.headers.token;
  
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
  
      // Decode the token to get the user ID
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
  
      // Extract taskId from the route parameters
      const taskId = req.params.taskId;
  
      // Check for the presence of required parameters
     
  
      // Include userId and taskId in the request body
      const requestBody = {
        userId: userId,
        taskId: taskId,
        description: req.body.description,
        title: req.body.title,
        dueDate: req.body.dueDate,
      };
  
      const response = await axios.put(`${AWS_API_URL}`, requestBody);
  
      res.status(200).json(response.data);
    } catch (error) {
      next(error);
    }
  });
  

  router.delete('/:taskId', async (req, res, next) => {
    try {
      const token = req.headers.token;
  
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
  
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      const taskId = req.params.taskId;
  
      const response = await axios.delete(`${AWS_API_URL}`, {
        data: { userId: userId, taskId: taskId },
      });
  
      res.status(200).json(response.data);
    } catch (error) {
      next(error);
    }
  });
  
  

module.exports = router;
