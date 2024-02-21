const fs = require('node:fs');
const readline = 
require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const file_path = `${__dirname}/../.env`;

function create_config() {
    readline.question(`Insert token\n>> `, token => {
        fs.writeFile(file_path, `TOKEN=${token}`, err => {
            if (err) {
                console.error(err);
            } else {
                console.log(`Successfully created the configuration!`);
                process.exit(0);
            }
        });
    });
}

function overwrite_config() {
    readline.question(`The configuration already exists. Do you want to overwrite it?\n(y/n) >> `, choice => {
        if (choice.startsWith(`y`.toLowerCase())) {
            create_config();
        } else if (choice.startsWith(`n`.toLowerCase())) {
            process.exit(0);
        } else {
            console.log(`You must enter either y (yes) or n (no).`);
            overwrite_config();
        }
    });
}

fs.stat(file_path, (err, stats) => {
    if (err) {
        create_config();
    } else {
        overwrite_config();
    }
});