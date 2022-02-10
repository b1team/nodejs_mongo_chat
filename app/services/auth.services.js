const jwt = require('jsonwebtoken');
const userService = require("../services/user.services");
const authConfig = require("../config/auth.config")
const encryption = require("../utils/encryption");


const login = (username, password) => {
    return new Promise((resolve, reject) => {
        userService.getUserPassword(username)
            .then(user => {
                if (user == null) {
                    reject("Invalid username or password");
                    return;
                }
                verifyPassword(password, user.password).then(isValid => {
                    if (isValid) {
                        const payload = { "user_id": user.id, "username": username };
                        const token = jwt.sign(payload, authConfig.TOKEN_SECRET_KEY, {
                            expiresIn: authConfig.TOKEN_EXPIRE_IN,
                        });
                        resolve(token);
                    } else {
                        reject("Invalid username or password");
                    }
                }
                ).catch(err => {
                    console.warn("verify password of user " + user.username + " failed. error: " + err);
                    reject("Invalid username or password");
                }
                );
            })
            .catch(err => reject(err));
    });
}



const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, authConfig.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                reject("Invalid token");
            } else {
                userService.getUserInfo(decoded.user_id, (err, user) => {
                    if (err) reject(err);
                    else resolve(user);
                })
            }
        });
    });
}


// verify password vs encryptedPassword by bcrypt
const verifyPassword = (password, encryptedPassword) => {
    return new Promise((resolve, reject) => {
        encryption.verify(password, encryptedPassword).then(isValid => {
            resolve(isValid);
        }).catch(err => {
            reject(err);
        });
    });
}


module.exports = { login, verifyToken, verifyPassword }
