
const addEntries = require("./webpack/addEntries");
const applyMiddleware = require("./webpack/applyMiddleware");
const buildPlugins = require("./webpack/buildPlugins");
const baseConfig = require("./webpack/webpack.config");
const withBanner = require("./webpack/withBanner");
const withCompression = require("./webpack/withCompression");
const withLegacy = require("./webpack/withLegacy");
const buildConfigs = require("./webpack/build-configs.json");


module.exports = (env) => {
    const configs = [];

    const selectedConfigs = env.tasks
        ? env.tasks.split(",").map(task => buildConfigs.find(buildConfig => buildConfig.id === task))
        : buildConfigs;

    const selectedPluginConfigs = selectedConfigs.filter(buildConfig => buildConfig.type === "plugin");
    if (selectedPluginConfigs.length > 0) {
        const plugins = applyMiddleware({}, [
            baseConfig,
            buildPlugins,
            addEntries(selectedPluginConfigs)
        ]);

        configs.push(plugins);
    }

    const selectedCoreConfigs = buildConfigs.filter(buildConfig => buildConfig.type === "core");
    if (selectedCoreConfigs.length > 0) {   
        const core = applyMiddleware({}, [
            baseConfig,
            addEntries(selectedCoreConfigs)
        ]);

        configs.push(core);
    }

    if (env.legacy) {
        const legacyConfigs = configs.map(withLegacy);
        configs.push(...legacyConfigs);
    }

    return configs
        .map(config => withBanner(config))
        .map(config => env.compression ? withCompression(config) : config);
}