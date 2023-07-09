'use strict';

module.exports.createNote = async (event) => {
  return {
    statusCode: 201,
    body: JSON.stringify("A new note created!")
  };
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