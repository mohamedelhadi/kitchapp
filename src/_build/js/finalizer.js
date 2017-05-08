let fs = require('fs');
let _ = require('lodash');
let color = require('cli-color');

let gulp = require("gulp");
let rename = require('gulp-rename');

import { getVersionDetails } from './version';
import { default as environments } from "../json/environments.json";

let paths = {
    releaseApk: 'platforms/android/build/outputs/apk/android-release.apk',
    debugApk: 'platforms/android/build/outputs/apk/android-debug.apk'
    // TODO add iOS IPAs
}

export { copyOutput }

function copyOutput(env, platform) {
    if (platform === "android") {
        console.log(color.cyan("Copying " + platform + " build output.."));
        let destination = "./bin/" + platform + "/" + env;
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }
        getVersionDetails(env).then(versionDetails => {
            let formattedVersion = versionDetails.segments[0] + "." + _pad(versionDetails.segments[1]) + "." + _pad(versionDetails.segments[2], 3);
            let originalPath = env === environments.Production ? paths.releaseApk : paths.debugApk;
            let newPath = env + "_" + formattedVersion + '.apk';
            _clean(newPath);
            gulp.src(originalPath).pipe(rename(newPath))
                .pipe(gulp.dest(destination))
                .on('end', () => {
                    console.log(color.green("Done copying."));
                });
        });
    }
}

function _pad(segment, length = 2) {
    return _.padStart(segment, length, '0');
}

function _clean(path) { // removes previous build with same version
    if (fs.existsSync(path)) {
        del.sync([path]);
    }
}
