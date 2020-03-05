'use strict';

const httpStatusCode = require('http-status-codes');
const { OK, CREATED, NOT_FOUND } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { TABLES } = constants;
const { SELLER_TABLE, PRODUCT_TABLE } = TABLES;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;


module.exports.createProduct = async event => {
  try {
    const sellerId = event.pathParameters.sellerId;
    const record = await db.getById(SELLER_TABLE, sellerId);

    if(record) {
      const { name, description } = JSON.parse(event.body);
      const data = {
        name, description,
        seller_id: sellerId
      };
      await db.insert(PRODUCT_TABLE, data);
      return successMessage(CREATED, {message: `Successfully added product ${name} to seller ${record.name}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'User does not exist.'});
  }
  catch(error) {
    console.log('[PRODUCT] Create product error: ', error);
    return errorMessage(error);
  }
}

module.exports.updateProduct = async event => {
  try {
    const id = event.pathParameters.id;
    const record = await db.getById(PRODUCT_TABLE, id);

    if(record) {
      const data = JSON.parse(event.body);
      await db.updateById(PRODUCT_TABLE, id, data);
      return successMessage(OK, {message: `Successfully updated product ${record.name}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Product does not exist.'});
  }
  catch(error) {
    console.log('[PRODUCT] Update product error: ', error);
    return errorMessage(error);
  }
}

module.exports.deleteProduct = async event => {
  try {
    const id = event.pathParameters.id;
    const record = await db.getById(PRODUCT_TABLE, id);
    const productName = record.name;
    // @TODO: Soft or hard delete?

    if(record) {
      const data = JSON.parse(event.body);
      await db.deleteById(PRODUCT_TABLE, id, data);
      return successMessage(OK, {message: `Successfully updated product ${record.name}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Product does not exist.'});
  }
  catch(error) {
    console.log('[PRODUCT] Delete product error: ', error);
    return errorMessage(error);
  }
}
