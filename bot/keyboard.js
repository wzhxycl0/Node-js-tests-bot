const language_kb = JSON.stringify({
    "inline_keyboard": [
        [{"text": "🇺🇸 | English",    "callback_data": "en"}],
        [{"text": "🇷🇺 | Русский",    "callback_data": "ru"}],
        [{"text": "🇺🇦 | Українська", "callback_data": "ua"}]
    ]
});

module.exports = { language_kb };