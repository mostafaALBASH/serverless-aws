const AWS = require("aws-sdk");
const S3 = new AWS.S3({ region: "us-east-1" });
const BUCKET_NAME = process.env.BUCKET_NAME;
const csvParser = require("csv-parser");
const { Readable } = require("stream");

const sendResponse = (statusCode, body) => {
  return {
    statusCode,
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Origin': '*', // Replace * with your allowed origins
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  };
};

module.exports.importProductsFile = async (event) => {
  const fileName = event.queryStringParameters.name;
  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await S3.getSignedUrlPromise("putObject", params);
    return sendResponse(200, signedUrl);
  } catch (error) {
    return sendResponse(500, error);
  }
};

module.exports.importFileParser = async (event) => {
  try {
    for (const record of event.Records) {
      const objectKey = record.s3.object.key;
      const params = {
        Bucket: BUCKET_NAME,
        Key: objectKey,
      };

      const s3Object = await S3.getObject(params).promise();
      const stream = new Readable();
      stream.push(s3Object.Body);
      stream.push(null);

      stream
        .pipe(csvParser())
        .on("data", (data) => console.log(data))
        .on("end", () => console.log("Parsing completed."));
    }

    return sendResponse(200, "File parsed successfully.");
  } catch (error) {
    return sendResponse(500, error);
  }
};
