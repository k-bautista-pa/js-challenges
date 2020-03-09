'use strict';

const httpStatusCode = require('http-status-codes');
const { OK, CREATED, NOT_FOUND } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { TABLES } = constants;
const { SELLER_TABLE, PRODUCT_TABLE } = TABLES;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;

const getSellerByIdQuery = id => { // implement "soft" delete
  return `
    SELECT * FROM ${SELLER_TABLE} WHERE id='${id}' AND is_deleted=false
  `;
}

const deleteSellerProductsQuery = sellerId => { // delete seller products
  return `
    UPDATE ${PRODUCT_TABLE}
    SET is_deleted=true
    WHERE seller_id='${sellerId}'
  `;
}

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

module.exports.updateSeller = async event => {
  try {
    const id = event.pathParameters.id;
    const rows = await db.query(getSellerByIdQuery(id));
    
    if(rows.length > 0) {
      const data = JSON.parse(event.body);
      const record = rows[0];
      await db.updateById(SELLER_TABLE, id, data);
      return successMessage(OK, {message: `Successfully updated user ${record.name}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Seller does not exist.'});
  }
  catch(error) {
    console.log('[SELLER] Update seller error: ', error);
    return errorMessage(error);
  }
}

module.exports.deleteSeller = async event => {
  try {
    const id = event.pathParameters.id;
    const rows = await db.query(getSellerByIdQuery(id));
    
    if(rows.length > 0) {
      const username = rows[0].name;
      await db.updateById(SELLER_TABLE, id, {is_deleted: true});
      await db.query(deleteSellerProductsQuery(id));
      return successMessage(OK, {message: `Successfully deleted ${username}.`});
    }

    return errorMessage({statusCode: NOT_FOUND, message: 'Seller does not exist.'});
  }
  catch(error) {
    console.log('[SELLER] Delete seller error: ', error);
    return errorMessage(error);
  }
}
