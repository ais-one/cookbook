const template = /*html*/`
<div>
  <!-- h1>Public Layout</h1 -->
  <router-view :key="$route.fullPath"></router-view>
</div>
`
export default {
  template
}
