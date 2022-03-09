
const addEntries = require("./webpack/addEntries");
const applyMiddleware = require("./webpack/applyMiddleware");
const buildPlugins = require("./webpack/buildPlugins");
const baseConfig = require("./webpack/webpack.config");
const withBanner = require("./webpack/withBanner");
const withCompression = require("./webpack/withCompression");
const withLegacy = require("./webpack/withLegacy");
const buildConfigs = require("./webpack/build-configs.json");



/**
 * Generates a webpack configuration that builds
 * webchat assets based on environment parameters.
 * 
 * By default, it will do a "production" build of everything.
 * - builds the webchat, message-renderer and all plugins
 * - emits .js and .legacy.js files
 * - emits .br and .gz compression variants
 * 
 * It's possible to ony build specific assets using 
 * an environment variable via command line argument: 
 * --env tasks=x
 * It's possible to define multiple ones by seperating them with a comma:
 * --env tasks=x,y
 * The available tasks are defined in webpack/build-configs.json.
 * You need to use the "id" field here.
 * 
 * It's possible to only build modern or legacy assets using
 * --env target=modern
 * or 
 * --env target=legacy 
 * or (the default option)
 * --env target=modern,legacy
 * 
 */
module.exports = (env) => {
    const configs = [];

    // by default, build everything
    let selectedConfigs = buildConfigs;

    // build jobs can be overridden by the "tasks" env
    if (env.tasks) {
        selectedConfigs = env.tasks
            .split(",")
            .map(task => buildConfigs.find(buildConfig => buildConfig.id === task));
    }

    // generate plugin webpack configs and push them to the config list
    const selectedPluginConfigs = selectedConfigs.filter(buildConfig => buildConfig.type === "plugin");
    if (selectedPluginConfigs.length > 0) {
        const plugins = applyMiddleware({}, [
            baseConfig,
            buildPlugins,
            addEntries(selectedPluginConfigs)
        ]);

        configs.push(plugins);
    }

    // generate core webpack configs and push them to the config list
    const selectedCoreConfigs = buildConfigs.filter(buildConfig => buildConfig.type === "core");
    if (selectedCoreConfigs.length > 0) {   
        const core = applyMiddleware({}, [
            baseConfig,
            addEntries(selectedCoreConfigs)
        ]);

        configs.push(core);
    }

    // by default, emit both modern and legacy builds
    let buildModern = true;
    let buildLegacy = true;

    if (env.target) {
        const options = env.target.split(',');
        buildModern = options.includes('modern');
        buildLegacy = options.includes('legacy');
    }




    if (env.legacy) {
        const legacyConfigs = configs.map(withLegacy);
        configs.push(...legacyConfigs);
    }

    return configs
        .map(config => withBanner(config))
        .map(config => env.compression ? withCompression(config) : config);
}