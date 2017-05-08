import { IConfiguration, Environments } from "./configuration";
import { simulator } from "../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    Environment: string = Environments.Simulator;
    Seed = true;

    private _baseUrl: string = simulator; // "http://localhost:8101/json/"; // "http://localhost:37864/"; //

    constructor() {
        this.init();
    }

    init(): void {
        this._baseUrl = this._baseUrl.replace(/\/?(\?|#|$)/, "/$1"); // append "/" if it's not already appended
        /*window.onload = (event) => {
            if (window.location.hash.indexOf("#/app") > -1) {
                window.location.replace("http://localhost:3000/");
            }
        };*/
    }

    get BaseUrl(): string {
        return this._baseUrl;
    }

    static get Instance() {
        return new Configuration();
    }
}