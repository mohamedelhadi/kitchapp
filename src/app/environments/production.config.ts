import { IConfiguration, Environments } from "./configuration";
import { production } from "../../_build/json/endpoints.json";

export class Configuration implements IConfiguration {

    public Environment: string = Environments.Production;
    public OneSignalAppID: string = "e968fd14-bd05-47a0-8f5e-462485446a4c";
    public GoogleProjectNo: string = "773081189088";
    public FacebookAppID: string = "1462290493817069";

    private baseUrl: string = production;

    constructor() {
        this.init();
    }

    public init(): void {
        this.baseUrl = this.baseUrl.replace(/\/?(\?|#|$)/, "/$1"); // append "/" if it's not already appended
    }

    get BaseUrl(): string {
        return this.baseUrl;
    }

    static get Instance() {
        return new Configuration();
    }
}
