'use strict';
const DynamoDB = require("aws-sdk/clients/dynamodb")
const documentClient = new DynamoDB.DocumentClient(
  {
    region: 'us-east-1',
    maxRetries: 3,
    httpOptions: {
      timeout: 5000
    }
  }
);
//const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;  // uncomment this line when deploying to aws.
const NOTES_TABLE_NAME = "notes"; // for local debug

const send  = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data)
  }
}

module.exports.createNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: "attribute_not_exists(notesId)",
    };
    await documentClient.put(params).promise();
    cb(null, send(201, data));
  } catch (error) {
    cb(null,send(500, error.message));
  }
};

module.exports.updateNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id;
  let data = JSON.parse(event.body);
  
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {notesId},
      UpdateExpression: 'set #title = :title, #body = :body',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body' : 'body'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body
      },
      ConditionExpression: 'attribute_exists(notesId)'
    }
    documentClient.update(params).promise();

    cb(null, send(200,data))
  } catch (error) {
    cb(null, send(500,error.message))
  }
};
module.exports.deleteNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId
      },
      ConditionExpression: 'attribute_exists(notesId)'
    };
    documentClient.delete(params).promise();
    cb(null, send(200, notesId));
  } catch (error) {
    cb(null, send(500, error.message));
  }
};

module.exports.getAllNotes = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    }
    const notes = await documentClient.scan(params).promise();
    cb(null, send(200,notes));
  } catch (error) {
    cb(null, send(500,error.message))
  }
};