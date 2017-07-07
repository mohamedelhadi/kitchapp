let copy = require("copy");
let fs = require("fs");
let cheerio = require("cheerio");
let color = require("cli-color");
let del = require("del");

let gulp = require("gulp");
let rename = require("gulp-rename");
let builder = require("content-security-policy-builder");

import {
    getVersionDetails
} from "./version";
import {
    default as environments
} from "../json/environments";
import {
    default as endpoints
} from "../json/endpoints";
import {
    default as whitelist
} from "../json/whitelist";

export {
    initialize
};

function initialize(env, platform) {
    console.log("\ninitializer.js\nTargeted Environment: ", color.yellow("'" + env + "'"), "\nTargeted Platform: ", color.yellow("'" + platform + "'\n"));
    let configPromise = _copyConfiguration(env);
    let resPromise = _copyResources(env, platform);
    let cordovaPromise = _prepareCordovaConfig(env);
    let indexPromise = _prepareIndex(env, platform);

    return Promise.all([configPromise, resPromise, cordovaPromise, indexPromise]);
}

function _copyConfiguration(env) {
    console.log(color.cyan("Copying " + env + " configurations..."));
    // fs.renameSync('../environments/' + env + '.config.ts', '../environments/env.config.ts');
    return new Promise((resolve, reject) => {
        gulp.src("src/app/environments/" + env + ".config.ts").pipe(rename("env.config.ts")).pipe(gulp.dest("src/app/environments"))
            .on("error", err => {
                console.log(color.red(err));
                console.log(color.white("\nCouldn't rename env config file!\n"));
                reject();
            })
            .on("end", () => {
                console.log(color.green("Done copying " + env + " configurations"));
                resolve();
            });
    });
}

function _copyResources(env, platform) {
    console.log(color.cyan("Copying resources..."));
    return new Promise((resolve, reject) => {
        copy("src/environments/resources/" + platform + "/icons/" + env + "/*", "resources/" + platform + "/icon", _callback("Done copying resources", "Couldn't copy resources!", resolve, reject));
    });
}

function _prepareCordovaConfig(env) {
    console.log(color.cyan("Preparing config.xml..."));
    let details = _getConfigDetails(env);
    return getVersionDetails(env).then(versionDetails => {
        let $ = cheerio.load(fs.readFileSync("config.xml"), {
            xmlMode: true,
            decodeEntities: false
        });
        $("widget").attr("id", details.packageName);
        $("name").text(details.appName);
        $("widget").attr("version", versionDetails.version);
        $("widget").attr("android-versionCode", versionDetails.androidVersionCode.toString());
        $("widget").attr("ios-CFBundleVersion", versionDetails.version);
        $("access").first().attr("origin", details.endpoint);
        $("allow-navigation").attr("href", details.endpoint);
        return new Promise((resolve, reject) => {
            fs.writeFile("config.xml", $.html(), _callback("Done preparing config.xml", "Couldn't save config.xml!", resolve, reject));
        });
    });
}

function _prepareIndex(env, platform) {
    console.log(color.cyan("Preparing index.html..."));

    let $ = cheerio.load(fs.readFileSync("src/index.html"), {
        decodeEntities: false // to avoid converting single quotes (in content security policy) to &apos;
    });
    // if target is the simulator (browser) omit cordova.js otherwise add it
    // cordova script performs initializations that doesn't work on the simulator so we remove it (however cordova script is required on an emulator/real device)
    let cordovaScript = env === environments.Simulator || platform === "pwa" ? "" : "cordova.js";
    $("#cordova-script").attr("src", cordovaScript);

    let text = $("#service-worker").text();
    if (platform === "pwa") {
        text = text.replace(/(\/\*|\*\/)/g, "");
        $("#service-worker").text(text);
    } else {
        if (text.indexOf("/*") === -1) {
            $("#service-worker").text(`/*${text}*/`);
        }
    }

    // Content-Security-Policy
    let endpoint = _getEndpoint(env);
    const csp = _getCSP(env, endpoint);
    $("#csp").attr("content", csp);

    return new Promise((resolve, reject) => {
        fs.writeFile("src/index.html", $.html(), _callback("Done preparing index.html", "Couldn't save index.html!", resolve, reject));
    });

}

function _getCSP(env, endpoint) {
    let directives = {
        defaultSrc: [],
        styleSrc: [],
        frameSrc: [],
        imgSrc: [],
        scriptSrc: [],
        connectSrc: []
    };
    // tslint:disable-next-line:forin
    for (const key in whitelist) {
        if (key === env || key === "default") {
            directives.defaultSrc = directives.defaultSrc.concat(whitelist[key].defaultSrc ? whitelist[key].defaultSrc : []);
            directives.styleSrc = directives.styleSrc.concat(whitelist[key].styleSrc ? whitelist[key].styleSrc : []);
            directives.frameSrc = directives.frameSrc.concat(whitelist[key].frameSrc ? whitelist[key].frameSrc : []);
            directives.imgSrc = directives.imgSrc.concat(whitelist[key].imgSrc ? whitelist[key].imgSrc : [], endpoint);
            directives.scriptSrc = directives.scriptSrc.concat(whitelist[key].scriptSrc ? whitelist[key].scriptSrc : [], endpoint);
            directives.connectSrc = directives.connectSrc.concat(whitelist[key].connectSrc ? whitelist[key].connectSrc : [], endpoint);
        }
    }
    return builder({
        directives
    });
}

function _callback(successMessage, errorMessage, resolve, reject) {
    return err => {
        if (err) {
            console.log(color.red(err));
            console.log(color.white(errorMessage + "\n"));
            reject();
        } else {
            console.log(color.green(successMessage));
            resolve();
        }
    };
}

function _getConfigDetails(env) {
    let appName = "Kitchapp";
    let packageName = "com.sudapps.kitchapp";
    switch (env) {
        case environments.Production:
            break;
        default:
            packageName = packageName + "." + env;
            appName = appName + " - " + env;
    }
    return {
        packageName: packageName,
        appName: appName,
        endpoint: _getEndpoint(env)
    };
}

function _getEndpoint(env) {
    switch (env) {
        case environments.Simulator:
        case environments.Dev:
            return "*";
        default:
            return _getOrigin(endpoints[env]);
    }
}

function _getOrigin(url) {
    return url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/, "$1").replace(/\/$/, "");
}