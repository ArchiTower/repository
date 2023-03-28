const { createConfig } = require('semantic-release-config-gitmoji/lib/createConfig');

const config = createConfig({
  monorepo: false
});

module.exports = config;

module.exports = {
  ...config,
  branches: [
    "main",
    { name: "develop", channel: "next", prerelease: "beta" },
  ],
  plugins: [
    ...config.plugins,
    ["@semantic-release/git", {
      "message": ":bookmark: build(release): ${nextRelease.version} [skip ci]"
    }]
  ]
};
