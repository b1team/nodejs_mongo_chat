const auth = require("../services/auth.services");


// login handler
const loginHandler = (req, res) => {
    // get the user from the database
    auth.login(req.body.username, req.body.password)
        .then(token => {
            res.json({ "access_token": token, "token_type": "bearer" });
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

module.exports = { loginHandler, verifyToken }