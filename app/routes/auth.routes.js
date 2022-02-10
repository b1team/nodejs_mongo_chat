module.exports = (app) => {
    const auth = require("../controllers/auth.controller");
    // create router
    const router = require("express").Router();


    // /token route
    router.post("/", auth.loginHandler);

    app.use("/token", router);
}