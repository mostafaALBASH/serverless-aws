const send = (statusCode, data) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // Replace * with your allowed origins
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(data),
  };
};


module.exports = send;
