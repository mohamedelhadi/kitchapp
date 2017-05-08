import { argv } from 'yargs';
import color from 'cli-color';
import { initialize } from './js/initializer';
import { copyOutput } from './js/finalizer';

let env = argv._[0] || "simulator", platform = argv._[1] || "android", action = argv.action || "initialize";


if (action === "initialize") {
    initialize(env, platform)
        .then(() => {
            console.log("\n" + color.yellow("Finished initializing.") + "\n");
        })
        .catch(() => {
            process.exit(1);
        });
} else if (action === "copy-output") {
    copyOutput(env, platform);
} else {
    console.log(color.red("\nError@cli.js Unknown action!\n"));
    process.exit(1);
}