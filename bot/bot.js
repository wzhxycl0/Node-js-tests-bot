require('dotenv').config;

const User = require('./../utils/sql');
const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(process.env.TOKEN, { polling: true });
const { language_kb } = require('./keyboard');
const caption = require('./caption.json');

const start = () => {
    bot.on('message', async data => {
        const chat = data.chat.id;
        const text = data.text;
        const user = new User(data.from.id);
        
        if (!(await user.unavailability())) {
            await bot.sendMessage(chat, 'Select a language!', { reply_markup: language_kb });
        }
    });

    bot.on('callback_query', async data => {
        const chat = data.message.chat.id;
        const text = data.data;
        const user = new User(data.from.id);

        if (text.startsWith('reg:')) {
            const language = text.split(':')[1];
            let res = caption[language];
            if (await user.reg(language)) {
                res = res.reg;
            } else {
                res.error;
            }
            await bot.editMessageText(res, {message_id: data.message.message_id, chat_id: chat});
        }
    });
};

module.exports = start;