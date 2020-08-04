<template>
  <div class="container">
    <vaadin-grid><!-- page-size="10" height-by-rows -->
      <vaadin-grid-column
        v-for="(headerCol, index) in headerCols" :key="index"
        :path="headerCol.path"
        :header="headerCol.header">
      </vaadin-grid-column>
      <!--  for last column text-align="end" width="120px" flex-grow="0" -->
    </vaadin-grid>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { test, find } from '../http'

export default {
  name: 'DemoTable',
  setup() {
    const page = ref(1)
    const headerCols = ref([])

    onMounted(async () => {

      test()
      const rv = await find('/api/t4t/config/country')

      headerCols.value = Object.entries(rv.cols).map(item => {
        const [key, val] = item
        // console.log(item, key, val)
        return {
          path: key,
          header: val.label
        }
      })

      customElements.whenDefined('vaadin-grid').then(async function() {
        try {
          const rv = await find('/api/t4t/find/country', {
            page: page.value
          })
          document.querySelector('vaadin-grid').items = rv.results
        } catch (e) {
          console.log(e.toString())
        }

      })
    })

    return {
      page,
      headerCols
    }
  }
}
</script>

<style>
  #pages {
    display: flex;
    flex-wrap: wrap;
    margin: 20px;
  }

  #pages > button {
    user-select: none;
    padding: 5px;
    margin: 0 5px;
    border-radius: 10%;
    border: 0;
    background: transparent;
    font: inherit;
    outline: none;
    cursor: pointer;
  }

  #pages > button:not([disabled]):hover,
  #pages > button:focus {
    color: #ccc;
    background-color: #eee;
  }

  #pages > button[selected] {
    font-weight: bold;
    color: white;
    background-color: #ccc;
  }

  #pages > button[disabled] {
    opacity: 0.5;
    cursor: default;
  }
</style>

<!-- div id="pages"></div -->

<!-- script>
  customElements.whenDefined('vaadin-grid').then(function() {
    const grid = document.querySelector('vaadin-grid');
    const pagesControl = document.querySelector('#pages');
    let pages;

    updateItemsFromPage(1);

    function updateItemsFromPage(page) {
      if (page === undefined) {
        return;
      }

      if (!pages) {
        pages = Array.apply(null, {length: Math.ceil(Vaadin.GridDemo.users.length / grid.pageSize)}).map(function(item, index) {
          return index + 1;
        });

        const prevBtn = window.document.createElement('button');
        prevBtn.textContent = '<';
        prevBtn.addEventListener('click', function() {
          const selectedPage = parseInt(pagesControl.querySelector('[selected]').textContent);
          updateItemsFromPage(selectedPage - 1);
        });
        pagesControl.appendChild(prevBtn);

        pages.forEach(function(pageNumber) {
          const pageBtn = window.document.createElement('button');
          pageBtn.textContent = pageNumber;
          pageBtn.addEventListener('click', function(e) {
            updateItemsFromPage(parseInt(e.target.textContent));
          });
          if (pageNumber === page) {
            pageBtn.setAttribute('selected', true);
          }
          pagesControl.appendChild(pageBtn);
        });

        const nextBtn = window.document.createElement('button');
        nextBtn.textContent = '>';
        nextBtn.addEventListener('click', function() {
          const selectedPage = parseInt(pagesControl.querySelector('[selected]').textContent);
          updateItemsFromPage(selectedPage + 1);
        });
        pagesControl.appendChild(nextBtn);
      }

      const buttons = Array.from(pagesControl.children);
      buttons.forEach(function(btn, index) {
        if (parseInt(btn.textContent) === page) {
          btn.setAttribute('selected', true);
        } else {
          btn.removeAttribute('selected');
        }
        if (index === 0) {
          if (page === 1) {
            btn.setAttribute('disabled', '');
          } else {
            btn.removeAttribute('disabled');
          }
        }
        if (index === buttons.length - 1) {
          if (page === pages.length) {
            btn.setAttribute('disabled', '');
          } else {
            btn.removeAttribute('disabled');
          }
        }
      });

      var start = (page - 1) * grid.pageSize;
      var end = page * grid.pageSize;
      grid.items = Vaadin.GridDemo.users.slice(start, end);
    }
  });
</script -->