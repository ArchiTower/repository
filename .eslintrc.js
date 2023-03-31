module.exports = {
  extends: ["architower"],

  overrides: [
    {
      files: ["*.eslintrc.js", "commitlint.config.js", "release.config.js"],
      extends: ["architower/node"],
      rules: {
        "n/no-unpublished-require": "off",
      },
    },
  ],
}
