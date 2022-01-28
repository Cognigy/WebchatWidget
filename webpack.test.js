
const addEntries = require("./webpack/addEntries");
const applyMiddleware = require("./webpack/applyMiddleware");
const buildPlugins = require("./webpack/buildPlugins");
const baseConfig = require("./webpack/webpack.config");
const withBanner = require("./webpack/withBanner");
const withCompression = require("./webpack/withCompression");
const withLegacy = require("./webpack/withLegacy");

const fragments = [
    {
        id: "webchat",
        type: "core",
        name: "webchat",
        entry: "./src/webchat-embed/index.tsx"
    },
    {
        id: "message-renderer",
        type: "core",
        name: "message-renderer",
        entry: "./src/message-renderer/embed.ts"
    },
    {
        id: "adaptivecards-plugin",
        type: "plugin",
        name: "adaptivecards",
        entry: "./src/plugins/adaptivecards/index.tsx"
    },
    {
        id: "date-picker-plugin",
        type: "plugin",
        name: "date-picker",
        entry: "./src/plugins/date-picker/index.tsx"
    },
    {
        id: "messenger-plugin",
        type: "plugin",
        name: "messenger",
        entry: "./src/plugins/messenger/index.tsx"
    },
    {
        id: "rating-plugin",
        type: "plugin",
        name: "rating",
        entry: "./src/plugins/rating/index.ts"
    },
    {
        id: "speech-input-plugin",
        type: "plugin",
        name: "speech-input",
        entry: "./src/plugins/speech-input/index.tsx"
    },
    {
        id: "speech-output-plugin",
        type: "plugin",
        name: "speech-output",
        entry: "./src/plugins/speech-output/index.tsx"
    },
]

;


module.exports = (env, argv) => {
    const plugins = applyMiddleware({}, [
        baseConfig,
        buildPlugins,
        addEntries(fragments.filter(fragment => fragment.type === "plugin"))
    ]);

    const core = applyMiddleware({}, [
        baseConfig,
        addEntries(fragments.filter(fragment => fragment.type === "core"))
    ]);

    const configs = [core, plugins];

    if (env.LEGACY) {
        const legacyConfigs = configs.map(withLegacy);
        configs.push(...legacyConfigs);
    }

    return configs
        .map(config => withBanner(config))
        .map(config => env.COMPRESSION ? withCompression(config) : config);

}