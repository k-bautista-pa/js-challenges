'use strict';

const httpStatusCode = require('http-status-codes');
const { OK } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { VIEWS } = constants;
const { PRODUCTS_IN_CART, TOP_SELLER } = VIEWS;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;

module.exports.getProductReport = async event => {
  try {
    const rows = await db.getAll(PRODUCTS_IN_CART);
    return successMessage(OK, {products: rows});
  }
  catch(error) {
    console.log('[REPORT]: Product Report error: ', error);
    return errorMessage(error);
  }
}

module.exports.getTopSellers = async event => {
  try {
    const rows = await db.getAll(TOP_SELLER);
    return successMessage(OK, {sellers: rows});
  }
  catch(error) {
    console.log('[Report] Top Sellers Report error: ', error);
    return errorMessage(error);
  }
}

