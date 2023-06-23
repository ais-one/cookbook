<template>
  <div id="graph-test"></div>
</template>

<script>
import G6 from '@antv/g6'

// https://g6.antv.vision/en/docs/manual/tutorial/layout - TBD deal with multiple edges in auto layout
// NOSONAR const endArrow = true // { path: 'M 0,0 L 10,5 L 10,-5 Z', fill: '#333', }
const startArrow = true // { path: 'M 0,0 L 10,5 L 10,-5 Z', fill: '#f00', }
const endArrow = true // { path: G6.Arrow.vee(10, 15, 0), d: 0 }

// Arrows
// https://g6.antv.vision/en/docs/manual/middle/elements/edges/arrow

// Anchor Points
// https://g6.antv.vision/en/docs/manual/middle/elements/nodes/anchorpoint
const anchorLeft = [0, 0.5]
const anchorTop = [0.5, 0]
const anchorRight = [1, 0.5]
const anchorBottom = [0.5, 1]
const anchorPtsCardinal = [anchorTop, anchorRight, anchorBottom, anchorLeft]

const ANCHOR_TOP = 0
const ANCHOR_RIGHT = 1
const ANCHOR_BOTTOM = 2
const ANCHOR_LEFT = 3

const anchorTopLeft = [0, 0]
const anchorTopRight = [1, 0]
const anchorBottomLeft = [0, 1]
const anchorBottomRight = [1, 1]
const anchorPtsDiagonal = [anchorTopLeft, anchorTopRight, anchorBottomRight, anchorBottomLeft]

const anchorPts = [anchorTop, anchorTopRight, anchorRight, anchorBottomRight, anchorBottom, anchorBottomLeft, anchorRight, anchorTopLeft]

const data = {
  nodes: [
    {
      id: 'node0',
      label: 'N0',
      // x: 150, y: 150 // if this is taken out... edges will jump when you move nodes
    },
    {
      id: 'node1',
      label: 'N1',
      // x: 300, y: 150
    },
    {
      id: 'node2',
      label: 'N2',
      // x: 450, y: 150
    },
    {
      id: 'node3',
      label: 'N3',
      // x: 450, y: 50,
      // anchorPoints: [ [0, 0.5], [1, 0.5] ]
    }
  ],
  edges: [
    // Built-in arc edges
    {
      id: 'edge0',
      type: 'quadratic',
      source: 'node0',
      target: 'node1',
      // sourceAnchor: ANCHOR_RIGHT,
      // targetAnchor: ANCHOR_LEFT,
      label: 'E0 End',
      // curveOffset: 60,
      style: { endArrow }
    },
    {
      id: 'edge1',
      type: 'quadratic',
      source: 'node0',
      target: 'node1',
      // sourceAnchor: ANCHOR_RIGHT,
      // targetAnchor: ANCHOR_LEFT,
      label: 'E1 Start', // the bending degree
      // curveOffset: -50,
      style: { startArrow }
    },
    {
      id: 'edge2',
      type: 'quadratic',
      source: 'node0',
      target: 'node1',
      // sourceAnchor: ANCHOR_RIGHT,
      // targetAnchor: ANCHOR_LEFT,
      label: 'E2', // the bending degree
      // curveOffset: -120
    },
    {
      id: 'loop0',
      source: 'node0',
      target: 'node0',
      type: 'loop',
      style: {
        // stroke: '#F6BD16',
        endArrow
      },
      // loopCfg: {
      //   position: 'top',
      // },
      label: 'Loop 0'
    },
    {
      source: 'node1',
      target: 'node2',
      type: 'quadratic',
      label: 'D0',
      // sourceAnchor: ANCHOR_RIGHT,
      // targetAnchor: ANCHOR_LEFT,
      style: { endArrow }
    },
    {
      source: 'node1',
      target: 'node2',
      type: 'quadratic',
      label: 'D1',
      // curveOffset: 60,
      // sourceAnchor: ANCHOR_RIGHT,
      // targetAnchor: ANCHOR_LEFT,
      style: { startArrow }
    },
    {
      source: 'node1',
      target: 'node3',
      type: 'cubic-vertical',
      label: 'X0',
      // sourceAnchor: ANCHOR_TOP,
      // targetAnchor: ANCHOR_BOTTOM,
      style: { startArrow }
    }
  ]
}

import { onMounted } from 'vue'

export default {
  name: 'DemoGraph',
  setup() {
    onMounted(() => {
      const width = document.getElementById('graph-test').scrollWidth
      const height = document.getElementById('graph-test').scrollHeight || 500
      const graph = new G6.Graph({
        container: 'graph-test',
        width,
        height,
        linkCenter: false,
        fitCenter: true,
        // fitView: true,
        // fitViewPadding: [ 20, 40, 50, 20 ],
        modes: {
          default: ['drag-node', 'drag-canvas'], // drag-canvas zoom-canvas
          // edit: ['click-select'],
        },
        defaultNode: { // https://g6.antv.vision/en/docs/manual/middle/elements/nodes/defaultNode
          type: 'circle', // rect, star, triangle
          anchorPoints: anchorPtsCardinal,
        },
        defaultEdge: { // https://g6.antv.vision/en/docs/manual/middle/elements/edges/defaultEdge
          /* you can configure the global edge style as following lines */
          // style: {
          //   stroke: '#F6BD16',
          // },
          labelCfg: {
            autoRotate: true,
            refY: -10
          }
        },
        /* styles for different states, there are built-in styles for states: active, inactive, selected, highlight, disable */
        // edgeStateStyles: {
        //   // edge style of active state
        //   active: {
        //     opacity: 0.5,
        //     stroke: '#f00'
        //   },
        //   // edge style of selected state
        //   selected: {
        //     stroke: '#ff0'
        //     lineWidth: 3,
        //   },
        // },
        layout: {
          type: 'force', // Force layout
          linkDistance: 100, // The link distance is 100
          preventOverlap: true, // Prevent node overlappings
        },
      })

      graph.data(data)
      graph.render()

      graph.on('edge:mouseenter', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'active', true)
      })

      graph.on('edge:mouseleave', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'active', false)
      })

      graph.on('edge:click', (evt) => {
        const { item } = evt
        graph.setItemState(item, 'selected', true)
      })
      graph.on('canvas:click', (evt) => {
        graph.getEdges().forEach((edge) => {
          graph.clearItemStates(edge)
        })
      })
    })

    return {}
  }
}
</script>
