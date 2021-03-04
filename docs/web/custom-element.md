## Custom Element (Web Component) Samples

### Signature Pad

A component for capturing signature using canvas (component name: vcxwc-sign-pad)

Component file location [../@es-labs/esm/sign-pad.js](../@es-labs/esm/sign-pad.js)

Example can be found on example-vite DemoSignPad page

Example Usage file location [../example-vite/pages/DemoSignPad.vue](../example-vite/src/pages/DemoSignPad.vue)

Features
- handle attibutes and properties
- pass in json attributes as string for canvas context settings
- css variables
- handle events
- interactive with vuejs v-model

Customizable Styles

```css
vcxwc-sign-pad {
  --vcxwc-sign-pad-background-color: #faa;
}
```

Attributes
- width
- height
- context2d: 2D drawing context settings
- value (v-model used here, input event is created)

### Web Cam

A component for capturing image using webcam (component name: vcxwc-web-cam)

Component file location [../@es-labs/esm/web-cam.js](../@es-labs/esm/web-cam.js)

Example can be found on example-vite DemoWebCam page

Example Usage file location [../example-vite/pages/DemoWebCam.vue](../example-vite/src/pages/DemoWebCam.vue)

Features
- shadowDOM and litDOM
  - css variables
- shadowDOM
  - slots
  - slotted css and slot styles
  - slot events
  - use <link> to include other css files e.g. bulma, bootstrap
  - interactive with vuejs v-on

CSS Variables

```css
vcxwc-web-cam {
  --vcxwc-web-cam-top: 5%;
  --vcxwc-web-cam-right: 5%;
}
```

Attributes
- width
- height

Slots
- button-snap
- button-unsnap

Event Emitted
- snap


TBD - Using web component inside a web component