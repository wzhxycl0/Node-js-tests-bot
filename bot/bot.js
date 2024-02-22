require('dotenv').config;

const User = require('./../utils/sql');
const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(process.env.TOKEN, { polling: true });
const { language_kb, Keyboard } = require('./keyboard');
const caption = require('./caption.json');

const start = () => {
    bot.on('message', async data => {
        const chat = data.chat.id;
        const text = data.text;
        const user = new User(data.from.id);

        if (await user.unavailability()) {
            await bot.sendMessage(chat, 'Select a language!', { reply_markup: language_kb });

        } else if ( await user.get_state() == 1 ) {
            await bot.sendMessage(chat, text);
            await user.set_state(0);

        } else {
            const language = await user.get_language();
            const kb = new Keyboard(language);
            
            await bot.sendMessage(chat, caption[language].menu, 
            {reply_markup: kb.menu()});
        }
    });

    bot.on('callback_query', async data => {
        const chat = data.message.chat.id;
        const text = data.data;
        const user = new User(data.from.id);

        if ( text.startsWith('reg:') ) {
            let language = text.split(':')[1];
            let res = caption[language];
            
            if ( await user.reg(language) ) {
                res = res.reg;
            } else {
                res = res.error;
            }
            
            await bot.editMessageText(res, 
                {message_id: data.message.message_id, chat_id: chat, 
                reply_markup: new Keyboard(language.slice(0, 2)).goto()});
        
        } else {
            const language = await user.get_language();
            const kb = new Keyboard(language);

            if ( text === 'goto' ) {
                await bot.editMessageText(caption[language].menu, 
                {message_id: data.message.message_id, chat_id: chat,
                reply_markup: kb.menu()});
            
            } else if ( text === 'profile' ) {
                await bot.editMessageText(`${caption[language].profile[0]}\n\n${caption[language].profile[1]} ${chat}`,
                {message_id: data.message.message_id, chat_id: chat,
                reply_markup: kb.profile()});
            
            } else if ( text === 'create_test' ) {
                await user.set_state(1);
                await bot.editMessageText(caption[language].set_test_name, 
                    {message_id: data.message.message_id, chat_id: chat,
                    reply_markup: kb.create_test()});
            
            } else if ( text === 'cancel' ) {
                await bot.editMessageText(caption[language].menu, 
                {message_id: data.message.message_id, chat_id: chat,
                reply_markup: kb.menu()});
                user.set_state(0);
            }
        }
    });
};

module.exports = start;