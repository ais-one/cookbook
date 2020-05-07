import Signin from '../views/signin.js'

const template = /*html*/`
<template>
  <ms-signin />
</template>
`

export default {
  template,
  components: {
    'ms-signin': Signin
  }
}
