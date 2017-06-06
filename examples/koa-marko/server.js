require('marko/node-require');
const TrueLayer = require("./../..");
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body')();

// Get environment varibles
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = process.env.redirect_uri;

// Create TrueLayer client instance
const client = new TrueLayer.V1.Client({ client_id, client_secret });

// Create an array of scopes
const scopes = ["offline_access", "info", "accounts", "transactions", "balance"];

const home = require('./index');

router.get("/", async (ctx) => {
    ctx.type = 'text/html';
    ctx.body = await home.stream();
});

router.get("/auth", async (ctx) => {
    const authURL = client.auth.getAuthUrl(redirect_uri, scopes, "nouce", state = "", true);
    ctx.redirect(authURL);
});

router.post("/truelayer-redirect", koaBody, async (ctx) => {
    const code = ctx.request.body.code;
    const tokens = await client.auth.exchangeCodeForToken(redirect_uri, code);
    const info = await client.data.getInfo(tokens.access_token);
    ctx.type = "text/html";
    ctx.body =  JSON.stringify(info);
});

app.use(router.routes());

app.listen(5000, () => {
    console.log("Listening on port 5000...")
});