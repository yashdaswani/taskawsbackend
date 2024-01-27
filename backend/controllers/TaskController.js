// src/controllers/TaskController.js
const dynamoDB = require('../dynamodb');
const lambda = require('../lambda');
const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': req.userId,
      },
    };

    const result = await dynamoDB.scan(params).promise();
    const tasks = result.Items || [];
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Validate the task using AWS Lambda
    const lambdaParams = {
      FunctionName: process.env.LAMBDA_FUNCTION_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ title, description, dueDate }),
    };

    const lambdaResult = await lambda.invoke(lambdaParams).promise();
    const validationResult = JSON.parse(lambdaResult.Payload);

    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.message });
    }

    // Save the task in DynamoDB
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: {
        userId: req.userId,
        title,
        description,
        dueDate,
      },
    };

    await dynamoDB.put(params).promise();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        userId: req.userId,
        taskId: req.params.id,
      },
    };

    const result = await dynamoDB.get(params).promise();
    const task = result.Item;

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Validate the task using AWS Lambda
    const lambdaParams = {
      FunctionName: process.env.LAMBDA_FUNCTION_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ title, description, dueDate }),
    };

    const lambdaResult = await lambda.invoke(lambdaParams).promise();
    const validationResult = JSON.parse(lambdaResult.Payload);

    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.message });
    }

    // Update the task in DynamoDB
    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        userId: req.userId,
        taskId: req.params.id,
      },
      UpdateExpression: 'SET title = :title, description = :description, dueDate = :dueDate',
      ExpressionAttributeValues: {
        ':title': title,
        ':description': description,
        ':dueDate': dueDate,
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoDB.update(updateParams).promise();
    const updatedTask = result.Attributes;

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: {
        userId: req.userId,
        taskId: req.params.id,
      },
      ReturnValues: 'ALL_OLD',
    };

    const result = await dynamoDB.delete(params).promise();
    const deletedTask = result.Attributes;

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
