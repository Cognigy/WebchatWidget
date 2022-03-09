const getLegacyEntry = (entry) => ({
    import: [
        'whatwg-fetch', 
        'url-polyfill', 
        'idempotent-babel-polyfill',
        entry.import
    ]
});

const getLegacyEntries = (entries) => {
    return Object.entries(entries).reduce((legacyEntries, [name, oldEntry]) => {
        const legacyEntry = getLegacyEntry(oldEntry);
        legacyEntries[name] = legacyEntry;
        return legacyEntries;
    }, {});
};

const getLegacyRules = (rules) => rules.map(rule => {
    if (rule.loader === 'babel-loader') {
        rule.options.presets = ['@babel/preset-env', ...rule.options.presets];
    }

    return rule;
});

/**
 * Updates a build configuration to target legacy browsers
 * - emits a .legacy.js file
 * - adds polyfills
 * - adds babel-preset-env
 * - emits es5
 * 
 * used in production builds
 */
module.exports = (config) => ({
    ...config,
    entry: getLegacyEntries(config.entry),
    output: {
        ...config.output,
        filename: `${config.output.filename.slice(0, -3)}.legacy.js`
    },
    module: {
        ...config.module,
        rules: getLegacyRules(config.module.rules)
    },
    target: ["web", "es5"]
});