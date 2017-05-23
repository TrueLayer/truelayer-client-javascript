// 
import * as auth from "./authentication";
import * as data from "./dataApi";

interface IOptions {

}

export interface ApiClient {
    v1(options: object): {
        auth: auth,
        data: data
    }
}

const client = new Truelayer.ApiClient.v1(options);