const caption = require('./caption.json');

const language_kb = JSON.stringify({
    'inline_keyboard': [
        [{'text': '🇺🇸 | English',    'callback_data': 'reg:en'}],
        [{'text': '🇷🇺 | Русский',    'callback_data': 'reg:ru'}],
        [{'text': '🇺🇦 | Українська', 'callback_data': 'reg:ua'}]
    ]
});

const goto_kb = (language) => {
    return JSON.stringify({
        inline_keyboard: [
            [{'text': caption[language]['goto'], 'callback_data': 'goto'}]
        ]
    });
};

const menu_kb = (language) => {
    return JSON.stringify({
        inline_keyboard: [
            [{'text': caption[language]['menu_kb'][0], 'callback_data': 'profile'}],
            [{'text': caption[language]['menu_kb'][1], 'callback_data': 'create_test'}]
        ]
    });
};

module.exports = { language_kb, goto_kb, menu_kb };