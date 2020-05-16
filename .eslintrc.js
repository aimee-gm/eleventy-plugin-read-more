module.exports = {
  extends: ["eslint:recommended", "prettier"],
  env: { node: true, es2017: true },
  rules: {
    "arrow-body-style": ["error", "as-needed"],
  },
  overrides: [
    {
      files: "./test/**/*.js",
      env: { mocha: true },
    },
  ],
};
