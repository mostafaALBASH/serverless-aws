'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsList = async (event) => {
  const params = {
    TableName: process.env.PRODUCTS_TABLE
  };

  try {
    const data = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unable to get products' })
    };
  }
};

module.exports.getProductById = async (event) => {
  const productId = event.pathParameters.productId;
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id: productId
    }
  };

  try {
    const productData = await dynamodb.get(params).promise();
    if (!productData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found' })
      };
    }

    const stockParams = {
      TableName: process.env.STOCKS_TABLE,
      Key: {
        product_id: productId
      }
    };

    const stockData = await dynamodb.get(stockParams).promise();
    const product = {
      id: productData.Item.id,
      title: productData.Item.title,
      description: productData.Item.description,
      price: productData.Item.price,
      count: stockData.Item ? stockData.Item.count : 0
    };

    return {
      statusCode: 200,
      body: JSON.stringify(product)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unable to get product' })
    };
  }
};