const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('user.db');

db.run('CREATE TABLE IF NOT EXISTS user (id int, language str, state int DEFAULT 0)');
db.run('CREATE TABLE IF NOT EXISTS test (creator_id int, title str)');


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
                db.run('INSERT INTO user (id, language) VALUES (?, ?)', [this.user, language]);
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

    get_state() {
        return new Promise(resolve => {
            db.get('SELECT state FROM user WHERE id=?', [this.user], (err, row) => {
                resolve(row.state);
            });
        });
    }

    set_state(value) {
        db.run('UPDATE user SET state=? WHERE id=?', [value, this.user]);
    }

    get_tests() {
        return new Promise(resolve => {
            db.all('SELECT title FROM test WHERE id=?', [this.user], (err, row) => {
                return row;
            });
        });
    }
}


module.exports = User;