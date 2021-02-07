// const { validationError } = require('./errors.js');

/**
 * Verify that given object  has all specified fields
 * @param {object} object - Object that you want to validate
 * @param {object} fields - Array of fields that you want the object to have
 * @returns {object|boolean} Object that contains the error message and the list of absent fields or returns true if no error has occured
 */
const objectHasAllFields = (object, fields) => {
  const keys = Object.keys(object);
  const absentFields = [];

  if (keys.length === 0) {
    return { error: true, message: `Requered fields are absent!, ${fields}` };
  }

  fields.forEach((field) => {
    if (keys.indexOf(field) === -1) {
      absentFields.push(field);
    }
  });

  if (absentFields.length > 0) {
    return { msg: `Requered fields are absent!, ${absentFields}` };
  } else {
    return true;
  }
};

module.exports = objectHasAllFields;
