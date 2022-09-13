const config = require.main.require("./config/config");
const { post } = require("axios");

let defaultConfig = {
  actions: {
    log: async function (input) {
      console.log(input);
    },
    http: async function (input, config) {
      try {
        await post(config.endpoint, input);
        console.log(`📤 Data sent to ${config.endpoint}`);
      } catch (error) {
        console.log(`⚠ Data not sent to ${config.endpoint}`);
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

let appConfig = {
  ...defaultConfig,
  ...config,
};

appConfig.actions = { ...appConfig.actions, ...appConfig.plugins };
delete appConfig.plugins;

console.debug("Configuration", appConfig);

module.exports = appConfig;
