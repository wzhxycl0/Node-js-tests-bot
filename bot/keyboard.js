const caption = require('./caption.json');

const language_kb = JSON.stringify({
    'inline_keyboard': [
        [{'text': '🇺🇸 | English',    'callback_data': 'reg:en'}],
        [{'text': '🇷🇺 | Русский',    'callback_data': 'reg:ru'}],
        [{'text': '🇺🇦 | Українська', 'callback_data': 'reg:ua'}]
    ]
});


class Keyboard {
    constructor(language) {
        this.language = language;
    }

    goto() {
        return JSON.stringify({
            inline_keyboard: [
                [{'text': caption[this.language]['goto'], 'callback_data': 'goto'}]
            ]
        });
    };
    
    menu() {
        return JSON.stringify({
            inline_keyboard: [
                [{'text': caption[this.language]['menu_kb'][0], 'callback_data': 'profile'}],
                [{'text': caption[this.language]['menu_kb'][1], 'callback_data': 'create_test'}]
            ]
        });
    };
    
    create_test() {
        return JSON.stringify({
            inline_keyboard: [
                [{'text': caption[this.language].cancel, 'callback_data': 'cancel'}]
            ]
        });
    }
}


module.exports = { language_kb, Keyboard };