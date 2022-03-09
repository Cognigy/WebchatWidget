/**
 * Applies a set of "modifiers" to a webpack configuration,
 * one after another.
 */
module.exports = (config, modifiers) => modifiers.reduce((config, modifier) => modifier(config), config)