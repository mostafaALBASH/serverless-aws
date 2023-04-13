"use strict";
const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });
const { v4: uuidv4 } = require("uuid");
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;
const send = require("../helpers/send-response.helper");

module.exports.getProductById = async (event, context, cb) => {
  let productId = event.pathParameters.id;
  try {
    const productParams = {
      TableName: PRODUCTS_TABLE_NAME,
      Key: { id: productId },
    };

    const stockParams = {
      TableName: STOCKS_TABLE_NAME,
      Key: { product_id: productId },
    };

    const productData = await documentClient.get(productParams).promise();
    const stockData = await documentClient.get(stockParams).promise();

    if (!productData.Item) {
      cb(null, send(404, "Product not found"));
      return;
    }

    const product = {
      ...productData.Item,
      count: stockData.Item ? stockData.Item.count : 0,
    };

    cb(null, send(200, product));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
