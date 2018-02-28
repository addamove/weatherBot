const apiai = require('apiai');

const app = apiai('ac259b54f31c44b394229f6715be1f46');

function getSpeech(query) {
  const request = app.textRequest(query, {
    sessionId: 'asdf;lvzx',
  });
  const responseFromAPI = new Promise((resolve, reject) => {
    request.on('error', (error) => {
      reject(error);
    });
    request.on('response', (response) => {
      resolve(response.result);
    });
  });
  request.end();

  return responseFromAPI;
}

module.exports = {
  getSpeech,
};
