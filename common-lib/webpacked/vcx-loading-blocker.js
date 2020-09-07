import { LitElement, html, css } from 'lit-element'

class LoadingBlocker extends LitElement {
  static get styles () {
    return css`
      #overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100vh;
        background: rgba(0,0,0,0.75);
        z-index: 10;
        opacity: 1;
        pointer-events: all;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .lds-dual-ring {
        display: inline-block;
        width: 64px;
        height: 64px;
      }
      .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 46px;
        height: 46px;
        margin: 1px;
        border-radius: 50%;
        border: 5px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: lds-dual-ring 1.2s linear infinite;
      }
      @keyframes lds-dual-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `
  }

  static get properties () {
    return { loading: { type: Boolean } }
  }

  constructor () {
    super()
    this.loading = false
  }

  render () {
    return html`
      ${this.loading ? html`
        <div id="overlay">
          <div class="lds-dual-ring"></div>
        </div>
      ` : ''}
    `
  }
}

customElements.define('loading-blocker', LoadingBlocker)
