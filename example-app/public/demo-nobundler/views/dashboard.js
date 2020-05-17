const template = /*html*/`
<div class="container">
  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <div class="tile is-child box">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="http://via.placeholder.com/320x240" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <router-link to="sound">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="http://via.placeholder.com/96x96" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">Title 1</p>
                <p class="subtitle is-6">Subtitle 1</p>
              </div>
            </div>
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus nec iaculis mauris. <a>@bulmaio</a>.
              <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="tile is-parent">
      <div class="tile is-child box">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="http://via.placeholder.com/320x240" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <router-link to="vibration">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="http://via.placeholder.com/96x96" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">Title 2</p>
                <p class="subtitle is-6">Subtitle 2</p>
              </div>
            </div>
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus nec iaculis mauris. <a>@bulmaio</a>.
              <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child box">
        <!-- p class="title">Foo</p>
        <p class="subtitle">Bar</p -->
      </article>
    </div>
  </div>
</div>
`

export default {
  template,
  mounted () {
    // console.log('Dashboard Page')
  }
}
