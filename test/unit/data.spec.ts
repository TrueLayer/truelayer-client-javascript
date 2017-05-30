import test from "ava";
import * as TrueLayer from "../../index";

// Build 'options' to pass to APIClient
const options: TrueLayer.IOptions = {
    client_id: "client_id",
    client_secret: "client_secret"
};

const client = new TrueLayer.V1.ApiClient(options);

async function fn() {
    return Promise.resolve("foo");
}

test(async (t) => {
    t.is(await fn(), "foo");
});
