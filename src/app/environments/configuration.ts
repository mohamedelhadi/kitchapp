import { default as environments } from "../../_build/json/environments.json";

export const Environments: IEnvironments = environments;

interface IEnvironments {
    Simulator: "simulator";
    Dev: "dev";
    Testing: "testing";
    Staging: "staging";
    Production: "production";
}

export interface IConfiguration {

    Seed?: boolean;
    Environment: string; // "simulator" | "dev" | "testing" | "staging" | "production";
    BaseUrl: string;
    OneSignalAppID?: string;
    GoogleProjectNo?: string;

    init(): void;
}
