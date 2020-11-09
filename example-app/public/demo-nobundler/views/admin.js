const template = /*html*/`
<div>
  <h1>Admin</h1>
  <div class="dropdown"><!-- is-active -->
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu3">
        <span>Click me</span>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu3" role="menu">
      <div class="dropdown-content">
        <a href="#" class="dropdown-item">Overview</a>
        <a href="#" class="dropdown-item">Modifiers</a>
        <hr class="dropdown-divider">
        <a href="#" class="dropdown-item">More</a>
      </div>
    </div>
  </div>
</div>
`

const { onMounted } = Vue

export default {
  template,
  setup() {
    onMounted(async () => {
      console.log('Admin mounted!')
    })
    return {
    }
  }
}
