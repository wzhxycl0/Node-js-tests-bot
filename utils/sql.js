const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('user.db');

db.run(`CREATE TABLE IF NOT EXISTS user      (id int, language str, state char DEFAULT '0')`);
db.run('CREATE TABLE IF NOT EXISTS test      (creator_id int, title str)');
db.run('CREATE TABLE IF NOT EXISTS questions (test_id int, text str, position int)');
db.run('CREATE TABLE IF NOT EXISTS answers   (pos int, text str, correct bool)')


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
                try {
                    resolve(row.state);
                } catch {
                    resolve('0');
                }
            });
        });
    }

    set_state(value) {
        db.run('UPDATE user SET state=? WHERE id=?', [value, this.user]);
    }

    get_tests() {
        return new Promise(resolve => {
            db.all('SELECT title, rowid FROM test WHERE creator_id=?', [this.user], (err, row) => {
                resolve(row);
            });
        });
    }

    create_test(title) {
        db.run('INSERT INTO test VALUES (?,?)', [this.user, title]);
    }

    get_last_test() {
        return new Promise(resolve => {
            db.get('SELECT ROWID FROM test ORDER BY rowid DESC', (err, row) => {
                resolve(row.rowid);
            });
        });
    }
}


class Test {
    constructor(id) {
        this.id = id;
    }

    get_name() {
        return new Promise(resolve => {
            db.get('SELECT title FROM test WHERE rowid=?', [this.id], (err, row) => {
                resolve(row.title);
            });
        });
    }

    get_questions_number() {
        return new Promise(resolve => {
            db.all('SELECT * FROM questions WHERE test_id=?', [this.id], (err, row) => {
                resolve(row.length);
            });
        });
    }

    add_question(text, position) {
        db.run('INSERT INTO questions VALUES (?,?,?)', [this.id, text, position]);
    }

    add_answer(text, pos, correct) {
        db.run('INSERT INTO answers VALUES (?,?,?)', [pos, text, correct]);
    }
}

module.exports = { User, Test };