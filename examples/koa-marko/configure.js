const envalid = require("envalid");
const lasso = require("lasso");
require("marko/node-require");

// Configure lasso asset bundler
require("lasso").configure({
    plugins: [
        require("lasso-marko")
    ],
    outputDir: __dirname + "/static",
    urlPrefix: "./",
});

// Export environment variables
const { str, url } = envalid;
module.exports = envalid.cleanEnv(process.env, {
    CLIENT_ID: str(),
    CLIENT_SECRET: str(),
    REDIRECT_URI: url({ default: "http://localhost:5000/truelayer-redirect" })
});
