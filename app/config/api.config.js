const {
    API_PORT,
    API_TRUSTED_ORIGINS
} = process.env;
if (!API_TRUSTED_ORIGINS) {
    ALLOWED_ORIGINS = ["*"]
}
else {
    ALLOWED_ORIGINS = API_TRUSTED_ORIGINS.split(",");
}
if (!this.ALLOWED_ORIGINS) {
    this.ALLOWED_ORIGINS = ["*"]
}
module.exports = { API_PORT, ALLOWED_ORIGINS };
