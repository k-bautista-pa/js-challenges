'use strict';

const httpStatusCode = require('http-status-codes');
const { OK, CREATED, NOT_FOUND } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { TABLES } = constants;
const { SELLER_TABLE, PRODUCT_TABLE } = TABLES;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;

const getProductByIdQuery = id => { // implement "soft" delete
  return `
    SELECT * FROM ${PRODUCT_TABLE} WHERE id='${id}' AND is_deleted=false
  `;
}

module.exports.createProduct = async event => {
  try {
    const sellerId = event.pathParameters.id;
    const record = await db.getById(SELLER_TABLE, sellerId);

    if(record) {
      const { name, description } = JSON.parse(event.body);
      const data = {
        name, description,
        seller_id: sellerId,
        date_posted: (new Date()).toISOString()
      };
      await db.insert(PRODUCT_TABLE, data);
      return successMessage(CREATED, {message: `Successfully added product ${name} to seller ${record.name}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Seller does not exist.'});
  }
  catch(error) {
    console.log('[PRODUCT] Create product error: ', error);
    return errorMessage(error);
  }
}

module.exports.updateProduct = async event => {
  try {
    const id = event.pathParameters.id;
    const rows = await db.query(getProductByIdQuery(id));

    if(rows.length > 0) {
      const data = JSON.parse(event.body);
      const record = rows[0];
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
    const rows = await db.query(getProductByIdQuery(id));
    
    if(rows.length > 0) {
      const productName = rows[0].name;
      await db.updateById(PRODUCT_TABLE, id, {is_deleted: true});
      return successMessage(OK, {message: `Successfully deleted product ${productName}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Product does not exist.'});
  }
  catch(error) {
    console.log('[PRODUCT] Delete product error: ', error);
    return errorMessage(error);
  }
}
