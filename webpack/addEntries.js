const applyMiddleware = require("./applyMiddleware");

/**
 * Adds additional "entries" to a webpack configuration.
 * Will emit one output per entry.
 * The entries have the format from build-configs.json
 */
module.exports = entries => config => applyMiddleware(
    config, 
    entries.map(
        fragment => config => ({
            ...config,
            entry: {
                ...config.entry,
                [fragment.name]: {
                    import: fragment.entry
                }
            }
        })
));