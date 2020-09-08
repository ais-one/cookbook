import '@material/mwc-textfield'

const template = document.createElement('template')
template.innerHTML = `
<h1>Hi</h1>
<mwc-textfield></mwc-textfield>
<mwc-textfield></mwc-textfield>
`

class AutoComplete extends HTMLElement {
    constructor () {
      super()
      this.root = this.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(template.content.cloneNode(true))
      //   this.cards = []
      //   this.turnedCards = 0
    }
  
    // flipCard () {
    //   if (this.turnedCards < 2) {
    //     this.turnedCards++
    //   } else {
    //     this.turnedCards = 0
    //     this.cards.forEach(card => {
    //       card.flipCard(true)
    //     })
    //   }
    // }
  
    // set images (paths) {
    //   paths.forEach(path => {
    //     const card = document.createElement('memory-card')
    //     card.image = path
    //     this.cards.push(card)
    //   })
    // }
  
    // connectedCallback () {
    //   this.cards.forEach(card => {
    //     this.root.append(card)
    //   })
    // }
  }

  customElements.define('mwc-auto-complete', AutoComplete)
  