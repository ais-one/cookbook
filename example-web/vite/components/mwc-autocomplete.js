// import '@material/mwc-textfield'

const template = document.createElement('template')
template.innerHTML = `
<mwc-textfield></mwc-textfield>
<mwc-textfield></mwc-textfield>

<mwc-textfield
  :required="isRequired(col)"
  class="field-item"
  :key="col+index"
  :label="tableCfg.cols[col].label"
  outlined type="text"
  :value="recordObj[showForm][col]"
  @input="(e) => autoComplete(e, col, showForm)"
  @blur="(e) => console.log('blur', e)"
  @focus="(e) => console.log('focus', e)"
></mwc-textfield>
<div :key="'ac'+col+index" class="drop-down-div">
<mwc-list v-if="recordObj[showForm + 'Ac'][col].length" @selected="e => autoCompleteSelect(e, col, showForm)" class="drop-down">
  <mwc-list-item v-for="(option, index2) of recordObj[showForm + 'Ac'][col]" :key="col+index+'-'+index2">{{ option.text }}</mwc-list-item>
</mwc-list>
</div>

`
/*
*/
class AutoComplete extends HTMLElement {
    constructor () {
      super()
      this.root = this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
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

  customElements.define('mwc-autocomplete', AutoComplete)
  