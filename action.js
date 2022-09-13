const { debug } = require("console");
const config = require.main.require("./config/config");
const axios = require("axios");

let defaultConfig = {
  actions: {
    log: async function (input) {
      console.log(input);
    },
    http: async function (input, config) {
      try {
        await axios.post(config.endpoint, input);
        console.log(`Data sent to ${config.endpoint}`);
      } catch (error) {
        console.log(`Data not sent to ${config.endpoint}`);
      }
    },
  },
  invoke: async function (args) {
    config.pipeline.map(async (step) => {
      let executable = this.actions[step.name];
      await executable(args, step.config);
    });
  },
};

let actualConfig = {
  ...defaultConfig,
  ...config,
};

let actions = {
  ...actualConfig.actions,
  ...actualConfig.plugins,
};
actualConfig.actions = actions;
delete actualConfig.plugins;

console.debug(actualConfig);

module.exports = actualConfig;
