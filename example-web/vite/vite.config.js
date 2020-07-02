module.exports = {
  vueCompilerOptions: {
    isCustomElement: tag => tag.startsWith('vaadin-')
  }
}

// vueCompilerOptions
// compilerOptions
// app.config.isCustomElement = tag => {
//   console.log('tag', tag)
//   return tag === 'vaadin-button'
// }
