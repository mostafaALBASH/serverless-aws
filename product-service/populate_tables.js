const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
const PRODUCTS_TABLE_NAME = "products";
const STOCKS_TABLE_NAME = "stocks";

const testData = [
  // Copy the test data array provided above
];

const populateTables = async () => {
  for (const item of testData) {
    try {
      const productParams = {
        TableName: PRODUCTS_TABLE_NAME,
        Item: {
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
        },
      };

      const stockParams = {
        TableName: STOCKS_TABLE_NAME,
        Item: {
          product_id: item.id,
          count: item.count,
        },
      };

      await documentClient.put(productParams).promise();
      await documentClient.put(stockParams).promise();
      console.log(`Inserted item with ID ${item.id}`);
    } catch (err) {
      console.error(`Failed to insert item with ID ${item.id}:`, err);
    }
  }
};

populateTables();
