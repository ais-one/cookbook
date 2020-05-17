// https://forum.vuejs.org/t/remove-console-logs-from-production-buils/39327
// npm i -D babel-plugin-transform-remove-console
const plugins = []
if(process.env.NODE_ENV === 'production') {
  plugins.push("transform-remove-console")
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins
}
