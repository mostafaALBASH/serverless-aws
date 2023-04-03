"use strict";
const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient({ region: "us-east-1" });
const { v4: uuidv4 } = require("uuid");
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;
const send = require("../../helpers/send-response.helper");

module.exports.updateProduct = async (event, context, cb) => {
  let productId = event.pathParameters.id;
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: PRODUCTS_TABLE_NAME,
      Key: { id: productId },
      UpdateExpression:
        "set #title = :title, description = :description, price = :price",
      ExpressionAttributeNames: {
        "#title": "title",
      },
      ExpressionAttributeValues: {
        ":title": data.title,
        ":description": data.description,
        ":price": data.price,
      },
      ConditionExpression: "attribute_exists(id)",
    };
    await documentClient.update(params).promise();
    cb(null, send(200, data));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
