<template>
  <div class="overlay" v-if="loading">
    <img src="data:image/svg+xml;base64,PCEtLSBodHRwczovL2NvZGVwZW4uaW8vYXVyZXIvcGVuL2pFR2JBIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCiAgICB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwIDUwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjQiIGhlaWdodD0iNyIgZmlsbD0iIzQxYjg4MyI+CiAgICA8YW5pbWF0ZVRyYW5zZm9ybSAgYXR0cmlidXRlVHlwZT0ieG1sIgogICAgICBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIgogICAgICB2YWx1ZXM9IjEsMTsgMSwzOyAxLDEiCiAgICAgIGJlZ2luPSIwcyIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L3JlY3Q+CgogIDxyZWN0IHg9IjEwIiB5PSIwIiB3aWR0aD0iNCIgaGVpZ2h0PSI3IiBmaWxsPSIjNDFiODgzIj4KICAgIDxhbmltYXRlVHJhbnNmb3JtICBhdHRyaWJ1dGVUeXBlPSJ4bWwiCiAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiCiAgICAgIHZhbHVlcz0iMSwxOyAxLDM7IDEsMSIKICAgICAgYmVnaW49IjAuMnMiIGR1cj0iMC42cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgPC9yZWN0PgogIDxyZWN0IHg9IjIwIiB5PSIwIiB3aWR0aD0iNCIgaGVpZ2h0PSI3IiBmaWxsPSIjNDFiODgzIj4KICAgIDxhbmltYXRlVHJhbnNmb3JtICBhdHRyaWJ1dGVUeXBlPSJ4bWwiCiAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiCiAgICAgIHZhbHVlcz0iMSwxOyAxLDM7IDEsMSIKICAgICAgYmVnaW49IjAuNHMiIGR1cj0iMC42cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgPC9yZWN0Pgo8L3N2Zz4K" alt="Loading..." />
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.overlay {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  color: grey;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
