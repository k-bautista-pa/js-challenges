'use strict';

const httpStatusCode = require('http-status-codes');
const { OK, CREATED } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { TABLES } = constants;
const { SELLER_TABLE, PRODUCT_TABLE, CART_TABLE } = TABLES;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;


module.exports.getAllSellers = async event => {
  try {
    const rows = await db.getAll(SELLER_TABLE);
    return successMessage(OK, {sellers: rows});
  }
  catch(error) {
    console.log('[SELLER] GET All error: ', error);
    return errorMessage(error);
  }
}


module.exports.createSeller = async event => {
  try {
    const data = JSON.parse(event.body);
    await db.insert(SELLER_TABLE, data);
    return successMessage(CREATED, {message: `Succesfully created user ${data.name}.`});
  }
  catch(error) {
    console.log('[SELLER] Create seller error: ', error);
    return errorMessage(error);
  }
}

