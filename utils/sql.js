const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('user.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER, language TEXT)');
});


class User {
    constructor(user) {
        this.user = user;
    }

    async getUser() {
        return this.user;
    }

    async unavailability() {
        await db.serialize(() => {
            db.get('SELECT id FROM user WHERE id=?', [this.user], (err, row) => {
                if (!err) {
                    return 1;
                }
            });
        });
    }
}

module.exports = User;