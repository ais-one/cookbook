// we had to do this as we are still mutating states directly, may need to fix this...
// https://github.com/nuxt/nuxt.js/issues/1917
export const strict = false

// Problem in VueCrudX is this... (there could be more)
// store.state[name].defaultRec = this.crudForm.defaultRec
// store.state[name].filterData = this.crudFilter.filterData
// store.state[name].crudOps = this.crudOps

export const modules = {}
