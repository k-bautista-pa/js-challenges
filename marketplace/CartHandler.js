'use strict';

const httpStatusCode = require('http-status-codes');
const { OK, CREATED, NOT_FOUND } = httpStatusCode;

const db = require('./db_connect');
const constants = require('./util/constants');
const { TABLES, CART_PRODUCT_FIELDS } = constants;
const { PRODUCT_TABLE, CART_TABLE, CART_PRODUCT_TABLE } = TABLES;
const { CART_ID, PRODUCT_ID } = CART_PRODUCT_FIELDS;
const helpers = require('./util/helpers');
const { successMessage, errorMessage } = helpers;

const getCartProductQuery = (cartId, productId) => {
  return `
    SELECT * FROM ${CART_PRODUCT_TABLE}
    WHERE ${CART_ID}='${cartId}' AND ${PRODUCT_ID}='${productId}'
    AND is_deleted=false
  `;
}

module.exports.createCart = async event => {
  try {
    const currentDate = (new Date()).toISOString();
    const data = {
      date_created: currentDate,
      date_updated: currentDate
    }
    await db.insert(CART_TABLE, data);
    return successMessage(CREATED, {message: 'Successfully created new cart!'});
  }
  catch(error) {
    console.log('[CART] Create new cart error: ', error);
    return errorMessage(error);
  }
}

module.exports.addProductToCart = async event => {
  try {
    // check if cartId & productId exists
    const { cartId, productId } = event.pathParameters;
    const cart = await db.getById(CART_TABLE, cartId);
    const product = await db.getById(PRODUCT_TABLE, productId);

    if(!cart) return errorMessage({
      statusCode: NOT_FOUND, message: 'Cart does not exist.'
    });

    if(!product) return errorMessage({
      statusCode: NOT_FOUND, message: 'Product does not exist.'
    });

    // check if product already exists in cart
    const cartProduct = await db.query(getCartProductQuery(cartId, productId));
    const currentDate = (new Date()).toISOString();
    
    if(cartProduct.length === 0) { // first time adding specific product to cart
      const { quantity } = JSON.parse(event.body);
      const data = {
        cart_id: cartId,
        product_id: productId,
        quantity,
        date_added: currentDate,
        date_updated: currentDate
      };
      await db.insert(CART_PRODUCT_TABLE, data);
    }
    else { // additional quantity of a specific product in a cart
      const { id, quantity } = cartProduct[0];
      const { quantity: addQty } = JSON.parse(event.body);
      const data = {
        quantity: (quantity + addQty),
        date_updated: currentDate
      };
      await db.updateById(CART_PRODUCT_TABLE, id, data);
    }
    
    await db.updateById(CART_TABLE, cartId, {date_updated: currentDate}); // update cart updated date
    return successMessage(OK, {message: `Succesfully added product ${product.name} to cart.`});
  }
  catch(error) {
    console.log('[CART] Add product to cart error: ', error);
    return errorMessage(error);
  }
}

/**
 * TODO: "Remove" item from cart
 *  1. Decrease quantity
 *  2. Totally remove (qty. = 0)
 * */ 
module.exports.removeProductFromCart = async event => {
  try {
    // check if cartId & productId exists in cart
    const { cartId, productId } = event.pathParameters;
    const cart = await db.getById(CART_TABLE, cartId);
    const product = await db.getById(PRODUCT_TABLE, productId);

    if(!cart) return errorMessage({
      statusCode: NOT_FOUND, message: 'Cart does not exist.'
    });

    if(!product) return errorMessage({
      statusCode: NOT_FOUND, message: 'Product does not exist.'
    });


  }
  catch(error) {
    console.log('[CART] Remove prodcut from cart error: ', error);
    return errorMessage(error);
  }
}
