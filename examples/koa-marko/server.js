// TrueLayer Client
const { AuthAPIClient, DataAPIClient } = require("./../..");

// Koa imports
const body = require("koa-body")();
const Koa = require("koa");
const router = require("koa-router")();
const serve = require("koa-static");
const session = require("koa-session");

const envalid = require("envalid");
const lasso = require("lasso");
require("marko/node-require");

// Get environment variables
const { str, url } = envalid;
const env = envalid.cleanEnv(process.env, {
    CLIENT_ID: str(),
    CLIENT_SECRET: str(),
    REDIRECT_URI: url({ default: "http://localhost:5000/truelayer-redirect" })
});

// Create TrueLayer client instance
const authClient = new AuthAPIClient({
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET
});

// Create an array of scopes
const scopes = [ "offline_access", "info", "accounts", "transactions", "balance" ];

// Configure lasso bundler
require("lasso").configure({
    plugins: [
        "lasso-marko",
    ],
    outputDir: __dirname + "/public",
});

// Require the marko templates
const index = require("./routes/index");
const result = require("./routes/result");

const app = new Koa();
app.use(serve(__dirname + "/public"));
app.use(session({ signed: false }, app));

// Error Handling
app.use(async(ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.stack;
  }
});

router.get("/", async (ctx) => {
    ctx.type = "text/html";
    ctx.body = await index.stream();
});

router.get("/auth", async (ctx) => {
    const authURL = authClient.getAuthUrl(env.REDIRECT_URI, scopes, "nonce", state = "foo", true);
    ctx.redirect(authURL);
});

router.get("/results/:id", async (ctx) => {
    ctx.type = "text/html";
    ctx.body = await result.stream({
        name: ctx.session.name,
        me: ctx.session.me,
        info: ctx.session.info,
        accounts: ctx.session.accounts,
        balance: ctx.session.balance
    });
});

router.post("/truelayer-redirect", body, async (ctx) => {
    const code = ctx.request.body.code;
    const tokens = await authClient.exchangeCodeForToken(env.REDIRECT_URI, code);
    ctx.session.me = await DataAPIClient.getMe(tokens.access_token);
    try {
        const info = await DataAPIClient.getInfo(tokens.access_token);
        ctx.session.info = info;
        console.log(JSON.stringify(info));
        const accounts = await DataAPIClient.getAccounts(tokens.access_token);
        ctx.session.accounts = accounts;
        ctx.session.balance = await DataAPIClient.getBalance(tokens.access_token, "");
    } catch (e) {
        console.log(e);
    }
    ctx.session.name = ctx.session.info.results[0].full_name;
    ctx.redirect(`/results/${ctx.session.name.replace(/\s+/g, "-").toLowerCase()}`);
});

app.use(router.routes());

app.listen(5000, () => { console.log("Listening on port 5000...") });