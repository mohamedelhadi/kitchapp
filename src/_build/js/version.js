let fs = require("fs");
let color = require("cli-color");

import { default as environments } from "../json/environments";
import { default as versions } from "../json/versions";

export { getVersionDetails };

let _versionSegments = {
    Major: 0,
    Minor: 1,
    Build: 2
};

function getVersionDetails(env, autoIncrement = false) {
    switch (env) {
        case environments.Production:
        case environments.Staging:
        case environments.Testing:
            let versionDetails = _getVersionDetails(env);
            if (autoIncrement) {
                versionDetails = _increaseVersion(versionDetails);
                return _saveChanges(env, versionDetails);
            }
            return Promise.resolve(versionDetails);
        case environments.Dev:
        case environments.Simulator:
            // there is no value in increasing development version
            return Promise.resolve({
                version: "1.0.0",
                segments: "1.0.0".split("."),
                androidVersionCode: 100000
            });
        default:
            console.log(color.red("\nError@version.getVersionDetails()\n"));
            console.log("\nUnknown env: '" + env + "' \n");
            return Promise.reject();
    }
}

function _getVersionDetails(env) {
    let segments = versions[env].split(".");
    return {
        version: segments[_versionSegments.Major] + "." + segments[_versionSegments.Minor] + "." + segments[_versionSegments.Build],
        segments: segments,
        androidVersionCode: _getAndroidVersionCode(segments)
    };
}

function _increaseVersion(versionDetails) {
    versionDetails.segments[_versionSegments.Build] = parseInt(versionDetails.segments[_versionSegments.Build], 10) + 1;
    return {
        version: versionDetails.segments[_versionSegments.Major] + "." + versionDetails.segments[_versionSegments.Minor] + "." + versionDetails.segments[_versionSegments.Build],
        segments: versionDetails.segments,
        androidVersionCode: _getAndroidVersionCode(versionDetails.segments)
    };
}

function _getAndroidVersionCode(segments) {
    // tslint:disable-next-line:radix
    return parseInt(segments[_versionSegments.Major]) * 10000 + parseInt(segments[_versionSegments.Minor]) * 100 + parseInt(segments[_versionSegments.Build]);
}

function _saveChanges(env, versionDetails) {
    return new Promise((resolve, reject) => {
        versions[env] = versionDetails.version;
        fs.writeFile("./src/_build/json/versions.json", JSON.stringify(versions, null, "\t"), err => {
            if (err) {
                console.log(color.red(err));
                console.log("\nCouldn't save new version to file version.json!\n");
                reject();
            }
            else {
                resolve(versionDetails);
            }
        });
    });
}