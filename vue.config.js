const { defineConfig } = require("@vue/cli-service")

module.exports = defineConfig({
  transpileDependencies: [
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]src/,
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]package/,
  ]

})
