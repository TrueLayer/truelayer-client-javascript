require('marko/node-require');
const {AuthAPIClient, DataAPIClient} = require("./../..");
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body')();
const envalid = require("envalid");
const {str, url} = envalid;

// Get environment variables

const env = envalid.cleanEnv(process.env, {
    CLIENT_ID: str(),
    CLIENT_SECRET: str(),
    REDIRECT_URI: url({default: "http://localhost:5000/truelayer-redirect"})
});

// Create TrueLayer client instance
const authClient = new AuthAPIClient({
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET
});

// Create an array of scopes
const scopes = ["offline_access", "info", "accounts", "transactions", "balance"];

const home = require('./index');

router.get("/", async (ctx) => {
    ctx.type = 'text/html';
    ctx.body = await home.stream();
});

router.get("/auth", async (ctx) => {
    const authURL = authClient.getAuthUrl(env.REDIRECT_URI, scopes, "nonce", state = "foo", true);
    ctx.redirect(authURL);
});

router.post("/truelayer-redirect", koaBody, async (ctx) => {
    const code = ctx.request.body.code;
    const tokens = await authClient.exchangeCodeForToken(env.REDIRECT_URI, code);
    const info = await DataAPIClient.getInfo(tokens.access_token);
    ctx.type = "text/html";
    ctx.body = JSON.stringify(info);
});

app.use(router.routes());

app.listen(5000, () => {
    console.log("Listening on port 5000...")
});