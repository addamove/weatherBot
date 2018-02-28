/*
TODO

*/

const { Bot } = require('@dlghq/dialog-bot-sdk');
const ai = require('./apiai');
const w = require('./weather_api');
const config = require('./config');
const _ = require('lodash');

const bot = new Bot(config.testBotConfig);

// const state = {};

// const users = {};
// async function f(params) {
//   const r = await w.currentWeather('Москва');
//   console.log(r);
// }
// f();
//

bot.onMessage(async (peer, message) => {
  ai.getSpeech(message.content.text).then(async (res) => {
    await bot.sendTextMessage(peer, res.fulfillment.speech);

    if (_.has(res, 'parameters.weather') && _.has(res, "parameters['geo-city']")) {
      const r = await w.currentWeather(res.parameters['geo-city']);
      bot.sendTextMessage(peer, r);
    }
  });
});

bot.onInteractiveEvent(async (event) => {});
