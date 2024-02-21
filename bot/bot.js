require('dotenv').config;

const User = require('./../utils/sql');
const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(process.env.TOKEN, { polling: true });

const start = () => {
    bot.on('message', async data => {
        const user = new User(data.from.id);
        const text = data.text;

        console.log(await user.unavailability());
    });
};

module.exports = { start };