const { defineConfig } = require("@vue/cli-service")

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: [
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]src/,
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]package/,
  ]
})
