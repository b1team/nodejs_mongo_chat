// load secret key and expire time from .env
const {
    TOKEN_SECRET_KEY,
    TOKEN_EXPIRE_IN
} = process.env;
module.exports = { TOKEN_SECRET_KEY, TOKEN_EXPIRE_IN };
