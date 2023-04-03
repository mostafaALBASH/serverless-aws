"use strict";
const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });
const { v4: uuidv4 } = require("uuid");
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;
const send = require("../../helpers/send-response.helper");

// Create Product function
module.exports.createProduct = async (event, context, cb) => {
  let data = JSON.parse(event.body);
  try {
    const productId = uuidv4();
    const productParams = {
      TableName: PRODUCTS_TABLE_NAME,
      Item: {
        id: productId,
        title: data.title,
        description: data.description,
        price: data.price,
      },
    };

    const stockParams = {
      TableName: STOCKS_TABLE_NAME,
      Item: {
        product_id: productId,
        count: data.count,
      },
    };

    await documentClient.put(productParams).promise();
    await documentClient.put(stockParams).promise();
    cb(null, send(201, { ...data, id: productId }));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
