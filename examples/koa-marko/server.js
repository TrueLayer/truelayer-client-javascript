// Koa
const Koa = require("koa");
const serve = require("koa-static");
const session = require("koa-session");

// Create Koa instance
const app = new Koa();

// Serve the contents of the static folder
app.use(serve(__dirname + "/static"));
// Allow for session cookies
app.use(session({ key: "access_token", signed: false, httpOnly: false }, app));

// Get routes and serve
const api = require("./routes");
app.use(api.routes());

app.listen(5000, () => {
    console.log("Listening on port 5000...")
});
