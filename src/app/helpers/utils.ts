import { Injectable } from "@angular/core";
import { Configuration } from "../../environments/env.config";
import { Environments } from "../../environments/configuration";

@Injectable()
export class Utils {

    constructor(private config: Configuration) { }

    isDev() {
        return this.config.Environment === Environments.Dev || this.config.Environment === Environments.Simulator;
    }
}