const translate = require('translate');
const weather = require('weather-js');

translate.engine = 'yandex';
translate.key =
  'trnsl.1.1.20180228T094347Z.120dc8f39e9a5ee3.15272afd0704789027522e076ca02d8ec42399c2';

async function currentWeather(city) {
  return new Promise(async (resolve, reject) => {
    const c = await translate(city, 'en');

    weather.find({ search: c, degreeType: 'C' }, async (err, result) => {
      if (err) reject(err);
      const t = await translate(`${result[0].current.day}+${result[0].current.skytext}`, 'ru');
      const res = `Сейчас ${t.split('+')[0].toLowerCase()} в ${c} ${
        result[0].current.temperature
      }°C ${t.split('+')[1].toLowerCase()}. Ощущается как ${result[0].current.feelslike}.`;

      resolve(res);
    });
  });
}

async function weatherForecast(city) {
  return new Promise(async (resolve, reject) => {
    const c = await translate(city, 'en');
    weather.find({ search: c, degreeType: 'C' }, async (err, result) => {
      if (err) reject(err);
      const res = await Promise.all(result[0].forecast.map(async (d) => {
        const skytextday = await translate(`${d.skytextday}`, 'ru');

        return `Дата: ${d.date}. Температура Макс:${d.high}, Мин:${d.low} ${skytextday} ${
          d.precip === '' || d.precip === '0' ? 'Без осадков' : ` Осадки ${d.precip} мм`
        }`;
      }));

      resolve(res.join('\n'));
    });
  });
}

module.exports = {
  currentWeather,
  weatherForecast,
};
