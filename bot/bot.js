require('dotenv').config;

const User = require('./../utils/sql');
const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(process.env.TOKEN, { polling: true });
const { language_kb } = require('./keyboard');

const start = () => {
    bot.on('message', async data => {
        const text = data.text;
        const chat = data.chat.id;
        const user = new User(data.from.id);
        
        if (!(await user.unavailability())) {
            await bot.sendMessage(chat, "*Select a language!*", { reply_markup: language_kb, parse_mode: "Markdown" });
        }
    });
};

module.exports = start;