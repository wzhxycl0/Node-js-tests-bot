require('dotenv').config;

const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = () => {
    bot.on('message', async data => {
        const user = data.from.id;
        const text = data.text;

        await bot.sendMessage(user, text);
    });
};

module.exports = { start };