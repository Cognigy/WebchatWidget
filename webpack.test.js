
const baseConfig = require("./webpack/webpack.config");
const withAlias = require("./webpack/withAlias");
const withBanner = require("./webpack/withBanner");
const withCompression = require("./webpack/withCompression");
const withLegacy = require("./webpack/withLegacy");

const fragments = [
    // {
    //     modifiers: "core",
    //     name: "webchat",
    //     entry: "./src/webchat-embed/index.tsx"
    // },
    // {
    //     type: "core",
    //     name: "message-renderer",
    //     entry: "./src/message-renderer/embed.ts"
    // },
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

const apply = (config, modifiers) => modifiers.reduce((config, modifier) => modifier(config), config);


module.exports = (env, argv) => {
    const pluginFragments = fragments.filter(fragment => fragment.type === "plugin");

    const pluginConfig = apply({...baseConfig}, [
        ...pluginFragments.map(fragment => config => ({
            ...config,
            entry: {
                ...config.entry,
                [fragment.name]: {
                    import: fragment.entry,
                }
            }
        })),
        config => ({
            ...config,
            output: {
                ...config.output,
                filename: `${config.output.filename.slice(0, -3)}.webchat-plugin.js`
            }
        }),
        withAlias
    ]);

    const configs = [pluginConfig];

    if (env.LEGACY) {
        const legacyConfigs = configs.map(withLegacy);
        configs.push(...legacyConfigs);
    }

    return configs
        .map(config => withBanner(config))
        .map(config => env.COMPRESSION ? withCompression(config) : config);

}