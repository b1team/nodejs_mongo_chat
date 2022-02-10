const bcrypt = require('bcrypt')
// encrypts a string using bcrypt
const encrypt = (string) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(string, 10, function (err, hash) {
            if (err) reject(err);
            else resolve(hash);
        });
    });
}

const verify = (string, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, hash, function (err, res) {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

module.exports = { encrypt, verify };
