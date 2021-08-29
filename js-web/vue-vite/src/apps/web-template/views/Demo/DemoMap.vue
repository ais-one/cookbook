<template>
  <div>
    <h1>Leaflet Map - TBD</h1>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// NOSONAR
// import 'leaflet-tracksymbol'
// import '@/assets/leaflet.latlng-graticule'

// stupid hack so that leaflet's images work after going through webpack
// import marker from 'leaflet/dist/images/marker-icon.png'
// import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
// import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import { onMounted } from 'vue'

export default {
  setup() {
    onMounted(async () => {
      const map = L.map('map').setView([51.505, -0.09], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      L.marker([51.5, -0.09]).addTo(map).bindPopup('A pretty CSS3 popup.<br> Easily customizable.').openPopup()
    })
  }
}
</script>

<style scoped>
.map {
  /* top: 50px; */
  width: 100%;
  /* calc(100vw -200px); */
  /* height: calc(100vh - 50px); */
  height: 100vh;
  margin: auto;
  z-index: 1;
}
</style>
