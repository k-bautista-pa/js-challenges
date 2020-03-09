'use strict';

const httpStatusCode = require('http-status-codes');
const { OK } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { REPORT_VIEWS } = constants;
const { PRODUCT_IN_CART, TOP_SELLER } = REPORT_VIEWS;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;

module.exports.getProductReport = async event => {
  try {
    const rows = await db.getAll(PRODUCT_IN_CART);
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
    const topSellers = rows.map((item, index) => {
      const { seller_id, seller_name, item_quantity_in_cart } = item;
      return {
        position: (index + 1),
        seller_id, seller_name, item_quantity_in_cart
      }
    })
    return successMessage(OK, {sellers: topSellers});
  }
  catch(error) {
    console.log('[Report] Top Sellers Report error: ', error);
    return errorMessage(error);
  }
}

