const applyMiddleware = require("./applyMiddleware");

module.exports = entries => config => applyMiddleware(config, entries.map(fragment => config => ({
        ...config,
        entry: {
            ...config.entry,
            [fragment.name]: {
                import: fragment.entry
            }
        }
    })
));