/*
TODO

*/

const { Bot } = require('@dlghq/dialog-bot-sdk');
const ai = require('./apiai');
const w = require('./weather_api');
const config = require('./config');
const _ = require('lodash');

const bot = new Bot(config.testBotConfig);

bot.onMessage(async (peer, message) => {
  ai.getSpeech(message.content.text).then(async (res) => {
    await bot.sendTextMessage(peer, res.fulfillment.speech);

    if (
      _.has(res, 'parameters.weather') &&
      (_.has(res, "parameters['geo-city']") && res.parameters['geo-city'] !== '')
    ) {
      if (_.has(res, 'parameters.date') || _.has(res, 'parameters.date-period')) {
        if (res.parameters.date === '' && !_.has(res, 'parameters.date-period')) {
          const r = await w.currentWeather(res.parameters['geo-city']);
          bot.sendTextMessage(peer, r);
          return;
        }
        const r = await w.weatherForecast(res.parameters['geo-city']);
        bot.sendTextMessage(peer, r);

        return;
      }
      const r = await w.currentWeather(res.parameters['geo-city']);
      bot.sendTextMessage(peer, r);
    }
  });
});
