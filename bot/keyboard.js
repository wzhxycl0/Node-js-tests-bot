const language_kb = JSON.stringify({
    'inline_keyboard': [
        [{'text': '🇺🇸 | English',    'callback_data': 'reg:en'}],
        [{'text': '🇷🇺 | Русский',    'callback_data': 'reg:ru'}],
        [{'text': '🇺🇦 | Українська', 'callback_data': 'reg:ua'}]
    ]
});

module.exports = { language_kb };