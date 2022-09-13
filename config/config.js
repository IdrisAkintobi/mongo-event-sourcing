module.exports = {
  pipeline: [
    {
      name: "log",
    },
    {
      name: "http",
      config: {
        endpoint: "https://en598765dsfrx.pipedream.net",
      },
    },
  ],
  plugins: {
    dummy: async function (input, config, context) {
      console.log("NOTHING");
      return input;
    },
  },
  databases: {
    test01: {
      collections: {
        test: {},
      },
    },
    test02: {
      collections: {},
    },
  },
};
