const { AuthAPIClient, DataAPIClient } = require("./../..");
const router = require("koa-router")();
const body = require("koa-body")();
const env = require("./configure")

// Create TrueLayer auth client instance
const authClient = new AuthAPIClient({
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET
});

// Create an array of scopes
const scopes = ["offline_access", "info", "accounts", "transactions", "balance"];

// Require page templates
const index = require("./routes/index");
const results = require("./routes/result");

router
    .get("/", indexHandler)
    .get("/auth", authHandler)
    .get("/results", resultsHandler)
    .post("/api/:endpoint", apiHandler)
    .post("/truelayer-redirect", body, getAccessToken);

    // TODO: make an api route that handles all ajax requests
    // TODO: style the site with simple bootstrap

/*
 * Route handler functions
 */
async function indexHandler(ctx) {
    ctx.type = "text/html";
    ctx.body = await index.stream();
};

async function authHandler(ctx) {
    const authURL = authClient.getAuthUrl(env.REDIRECT_URI, scopes, "nonce", state = "foo", true);
    ctx.redirect(authURL);
};

async function getAccessToken(ctx) {
    ctx.session.tokens = await authClient.exchangeCodeForToken(env.REDIRECT_URI, ctx.request.body.code);
    ctx.redirect("/results");
};

async function resultsHandler(ctx) {
    ctx.type = "text/html";
    ctx.body = await results.stream();
};

async function apiHandler(ctx) {
    const accessToken = ctx.request.body.access_token;
    console.log(accessToken);
    const tokens = await authClient.exchangeCodeForToken(env.REDIRECT_URI, ctx.session.code);
    try {
        ctx.session.me = await DataAPIClient.getMe(tokens.access_token);
        ctx.session.info = await DataAPIClient.getInfo(tokens.access_token);
        ctx.session.accounts = await DataAPIClient.getAccounts(tokens.access_token);
        ctx.session.balance = await DataAPIClient.getBalance(tokens.access_token, "");
    } catch (e) {
        console.log(e);
    }
    ctx.session.name = ctx.session.info.results[0].full_name;
    ctx.redirect(`/results/${ctx.session.name.replace(/\s+/g, "-").toLowerCase()}`);
};

module.exports = router;
