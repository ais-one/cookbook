<template>
  <div class="container">
    <vaadin-grid>
      <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
      <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
      <vaadin-grid-column path="location.city"></vaadin-grid-column>
      <vaadin-grid-column path="visitCount" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
    </vaadin-grid>
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  name: 'DemoTable',
  setup() {
    onMounted(() => {
      customElements.whenDefined('vaadin-grid').then(function() {
        // Assign an array of user objects as the grid's items
        document.querySelector('vaadin-grid').items = [
          {
            name: {
              first: 'Laura',
              last: 'Arnaud',
            },
            location: {
              city: 'Perpignan'
            },
            visitCount: 1
          }
        ]
      });
    })
  }
}
</script>