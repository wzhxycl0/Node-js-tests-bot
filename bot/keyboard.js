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

    profile() {
        return JSON.stringify({
            inline_keyboard: [
                [{'text': caption.get_tests[this.language], 'callback_data': 'get_tests'}],
                [{'text': caption.goto[this.language], 'callback_data': 'goto'}]
            ]
        });
    }

    goto() {
        return JSON.stringify({
            inline_keyboard: [
                [{'text': caption.goto[this.language], 'callback_data': 'goto'}]
            ]
        });
    };
    
    menu() {
        return JSON.stringify({
            inline_keyboard: [
                [{'text': caption.menu_kb[this.language][0], 'callback_data': 'profile'}],
                [{'text': caption.menu_kb[this.language][1], 'callback_data': 'create_test'}]
            ]
        });
    };
    
    create_test() {
        return JSON.stringify({
            inline_keyboard: [
                [{'text': caption.cancel[this.language], 'callback_data': 'cancel'}]
            ]
        });
    }

    render_tests(user) {
        return new Promise(async resolve => {
            let row = await user.get_tests();
    
            let kb = [];
    
            row.forEach((row) => {
                kb.push([{'text': row.title, 'callback_data': `test:${row.title}`}]);
            });

            kb.push([{'text': caption.goto[this.language], 'callback_data': 'goto'}])
    
            resolve(JSON.stringify({
                inline_keyboard: kb
            }));
        });
    }
}


module.exports = { language_kb, Keyboard };