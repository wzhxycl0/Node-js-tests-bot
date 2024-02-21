const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('user.db');

db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER, language TEXT)');


class User {
    constructor(user) {
        this.user = user;
    }

    unavailability() {
        return new Promise(resolve => {
            db.get('SELECT id FROM user WHERE id=?', [this.user],  (err, row) => {
                resolve(!Boolean(row));
            });
        });
    }

    reg(language) {
        return new Promise(async resolve => {
            if (await this.unavailability()) {
                db.run('INSERT INTO user VALUES (?, ?)', [this.user, language]);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    get_language() {
        return new Promise(resolve => {
            db.get('SELECT language FROM user WHERE id=?', [this.user], (err, row) => {
                resolve(row.language);
            });
        });
    }
}

module.exports = User;