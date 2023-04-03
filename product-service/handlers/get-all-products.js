"use strict";
const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });
const { v4: uuidv4 } = require("uuid");
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const send = require("../../helpers/send-response.helper");

module.exports.getAllProducts = async (event, context, cb) => {
  try {
    const params = {
      TableName: PRODUCTS_TABLE_NAME,
    };
    const products = await documentClient.scan(params).promise();
    const productList = products.Items; // Extract the array of products
    cb(null, send(200, productList));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};

