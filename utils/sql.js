const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('user.db');

db.run('CREATE TABLE IF NOT EXISTS user (id INTEGER, language TEXT)');

class User {
    constructor(user) {
        this.user = user;
    }

    unavailability() {
        db.get('SELECT id FROM user WHERE id=?', [this.user], (err, row) => {
            if (err) {
                console.error(err);
            } else {
                return !Boolean(row);
            }
        });
    }
}