'use strict';
const DynamoDB = require("aws-sdk/clients/dynamodb")
const documentClient = new DynamoDB.DocumentClient({region: 'us-east-1'})

module.exports.createNote = async (event, context, cb) => {
  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: "notes",
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body,
      },
      ConditionExpression: "attribute_not_exists(notesId)",
    };
    await documentClient.put(params).promise();
    cb(null, {
      statusCode: 201,
      body: JSON.stringify(data),
    });
  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message),
    });
  }
};

module.exports.updateNote = async (event) => {
  let notesId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify("The note with " + notesId + " has been updated!")
  };
};
module.exports.deleteNote = async (event) => {
  let notesId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify("The note with " + notesId + " has been deleted!")
  };
};

module.exports.getAllNotes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("All notes are returned.")
  };
};