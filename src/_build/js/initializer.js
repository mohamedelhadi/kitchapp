let copy = require("copy");
let fs = require("fs");
let cheerio = require("cheerio");
let color = require("cli-color");
let del = require("del");

let gulp = require("gulp");
let rename = require("gulp-rename");

import {
    getVersionDetails
} from "./version";
import {
    default as environments
} from "../json/environments";
import {
    default as endpoints
} from "../json/endpoints";

export {
    initialize
};

function initialize(env, platform) {
    console.log("\ninitializer.js\nTargeted Environment: ", color.yellow("'" + env + "'"), "\nTargeted Platform: ", color.yellow("'" + platform + "'\n"));
    let configPromise = _copyConfiguration(env);
    let resPromise = _copyResources(env, platform);
    let cordovaPromise = _prepareCordovaConfig(env);
    let indexPromise = _prepareIndex(env);

    return Promise.all([configPromise, resPromise, cordovaPromise, indexPromise]);
}

function _copyConfiguration(env) {
    console.log(color.cyan("Copying " + env + " configurations..."));
    // fs.renameSync('../environments/' + env + '.config.ts', '../environments/env.config.ts');
    return new Promise((resolve, reject) => {
        gulp.src("src/environments/" + env + ".config.ts").pipe(rename("env.config.ts")).pipe(gulp.dest("src/environments"))
            .on("error", err => {
                console.log(color.red(err));
                console.log(color.white("\nCouldn't save new version to file version.json!\n"));
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

function _prepareIndex(env) {
    console.log(color.cyan("Preparing index.html..."));

    let $ = cheerio.load(fs.readFileSync("src/index.html"), {
        decodeEntities: false // to avoid converting single quotes (in content security policy) to &apos;
    });
    // if target is the simulator (browser) omit cordova.js otherwise add it
    // cordova script performs initializations that doesn't work on the simulator so we remove it (however cordova script is required on an emulator/real device)
    let cordovaScript = env === environments.Simulator ? "" : "cordova.js";
    $("#cordova-script").attr("src", cordovaScript);

    // Content-Security-Policy
    let endpoint = _getEndpoint(env);
    let content = "default-src 'self' gap: https://ssl.gstatic.com; style-src 'self' https://*.googleapis.com 'unsafe-inline'; img-src https://placeholdit.imgix.net http://placehold.it https://notify.bugsnag.com 'self' https://*.gstatic.com https://*.googleapis.com " + endpoint + " data:; " +
        "script-src 'unsafe-inline' 'unsafe-eval' 'self' https://*.googleapis.com " + endpoint + "; connect-src 'self' https://*.googleapis.com " + endpoint + "; media-src *;";
    // script-src https://api.rollbar.com https://sentry.io http://localhost:35729/livereload.js https://codepush.azurewebsites.net
    // connect-src https://api.rollbar.com https://sentry.io ws://localhost:35729/livereload https://codepush.azurewebsites.net

    $("#csp").attr("content", content);
    return new Promise((resolve, reject) => {
        fs.writeFile("src/index.html", $.html(), _callback("Done preparing index.html", "Couldn't save index.html!", resolve, reject));
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
    let appName = "App";
    let packageName = "com.app";
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
            return endpoints[env].replace(/^((\w+:)?\/\/[^\/]+\/?).*$/, "$1").replace(/\/$/, "");
    }
}
