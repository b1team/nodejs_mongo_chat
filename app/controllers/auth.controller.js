const auth = require("../services/auth.services");
const url = require("url");


// login handler
const loginHandler = (req, res) => {
    // get the user from the database
    auth.login(req.body.username, req.body.password)
        .then(token => {
            res.status(200).send({ "access_token": token, "token_type": "bearer" });
        })
        .catch(err => {
            console.log("LOGIN ERROR: " + err)
            const message = "Invalid username or password";
            res.status(401).send({ "message": message });
        });
}

// verify token handler, check if "Authenication" in request header, if yes, check if the token is valid, if yes, add the user to the request
const verifyToken = (req, res, next) => {
    // check if "Authenication" in request header
    if (req.headers["authorization"]) {
        // get the token from the request header
        const token = req.headers["authorization"].split(" ")[1];
        // verify the token
        auth.verifyToken(token)
            .then(user => {
                // add the user to the request
                req.user = user;
                // go to the next middleware
                next();
            })
            .catch(err => {
                console.info(err);
                res.status(401).send({ "message": "Invalid token" });
            });
    } else {
        res.status(401).send({ "message": "No token provided" });
    }
}


const verifyWebsocketToken = (info, cb) => {
    const params = url.parse(info.req.url, true).query;
    const token = params.token;
    if (!token) {
        console.log("No token provided");
        cb(false, 401, 'Unauthorized');
    }
    else {
        auth.verifyToken(token).then(user => {
            info.req.user = user;
            cb(true);
        }).catch(
            err => {
                console.info("Invalid token: " + err);
                cb(false, 401, 'Unauthorized');
            }
        )
    }
}

module.exports = { loginHandler, verifyToken, verifyWebsocketToken }