require('dotenv').config;

const { User, Test } = require('./../utils/sql');
const TelegramApi = require('node-telegram-bot-api');
const bot = new TelegramApi(process.env.TOKEN, { polling: true });
const { language_kb, Keyboard } = require('./keyboard');
const caption = require('./caption.json');

const start = () => {
    bot.on('message', async data => {
        const chat = data.chat.id;
        const text = data.text;
        const user = new User(data.from.id);
        const state = new String(await user.get_state());

        if (await user.unavailability()) {
            await bot.sendMessage(chat, 'Select a language!', { reply_markup: language_kb });

        } else if ( state != '0' ) {
            let language = await user.get_language();
            let kb = new Keyboard(language);
            
            if ( state == '1' ) {
                await user.create_test(text);
                await bot.sendMessage(chat, caption.created_test[language], 
                { reply_markup: kb.test_created(await user.get_last_test()) });
            
            } else if (state.startsWith('add')) {
                let args = state.split(':');
                let test = new Test(args[1]);
                let pos = args[2];

                await test.add_question(text, pos);
                await bot.sendMessage(chat, caption.question_created[language],
                    { reply_markup: kb.goto() });
            }
            
            await user.set_state(0);

        } else {
            const language = await user.get_language();
            const kb = new Keyboard(language);
            
            await bot.sendMessage(chat, caption.menu[language], 
            { reply_markup: kb.menu() });
        }
    });

    bot.on('callback_query', async data => {
        const chat = data.message.chat.id;
        const text = data.data;
        const message_id = data.message.message_id;
        const user = new User(data.from.id);

        if ( text.startsWith('reg:') ) {
            let language = text.split(':')[1];
            let res = caption;
            
            if ( await user.reg(language) ) {
                res = res.reg;
            } else {
                res = res.error;
            }
            
            await bot.editMessageText(res[language], 
                {message_id: message_id, chat_id: chat, 
                reply_markup: new Keyboard(language.slice(0, 2)).goto()});
        
        } else {
            const language = await user.get_language();
            const kb = new Keyboard(language);

            if ( text === 'goto' ) {
                await bot.editMessageText(caption.menu[language], 
                {message_id: message_id, chat_id: chat,
                reply_markup: kb.menu()});
            
            } else if ( text === 'profile' ) {
                await bot.editMessageText(`${caption.profile[language][0]}\n\n${caption.profile[language][1]} ${chat}`,
                {message_id: message_id, chat_id: chat,
                reply_markup: kb.profile()});
            
            } else if ( text === 'create_test' ) {
                await bot.editMessageText(caption.set_test_name[language], 
                    {message_id: message_id, chat_id: chat,
                    reply_markup: kb.create_test()});
                    
                await user.set_state(1);
            
            } else if ( text === 'cancel' ) {
                await bot.editMessageText(caption.menu[language], 
                {message_id: message_id, chat_id: chat,
                reply_markup: kb.menu()});
                user.set_state(0);
            
            } else if ( text === 'get_tests' ) {
                await bot.editMessageText(caption.get_tests[language],
                {message_id: message_id, chat_id: chat,
                reply_markup: await kb.render_tests(user)});

            } else if ( text.startsWith('test:') ) {
                let test_id = text.split(':')[1];
                let test = new Test(test_id);
                let questions = await test.get_questions_number()

                await bot.editMessageText(
                `${caption.test_menu[language][0]}: ${await test.get_name()}\n` + 
                `${caption.test_menu[language][1]}: ${questions}`, 
                {message_id: message_id, chat_id: chat,
                reply_markup: kb.test_edit(test_id, questions+1)});
            
            } else if ( text.startsWith('add:') ) {
                let output = text.split(':');
                let test_id = output[1];
                let position = output[2];
                let test = new Test(test_id);

                await bot.editMessageText(caption.write_question[language], {
                    chat_id: chat, message_id: message_id,
                    reply_markup: kb.cancel() });

                user.set_state(`add:${test_id}:${position}`);
            }
        }
    });
};

module.exports = start;