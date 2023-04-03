"use strict";
const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });
const { v4: uuidv4 } = require("uuid");
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const send = require("../../helpers/send-response.helper");

module.exports.deleteProduct = async (event, context, cb) => {
  let productId = event.pathParameters.id;
  try {
    const params = {
      TableName: PRODUCTS_TABLE_NAME,
      Key: { id: productId },
      ConditionExpression: "attribute_exists(id)",
    };
    await documentClient.delete(params).promise();
    cb(null, send(200, productId));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
