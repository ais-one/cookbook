# example

> A example project using vue-crud-x component

## Installation

Assume vue-crud-x package is already installed

    cd node_modules/vue-crud-x/example
    npm install
    # create cfg.json based on cfg.sample.json
    npm run dev

## Sample

### Important notes

* primary key field name must be id - for now
* the example uses firestore, please signup for firebase and create user on firebase to access
* please see below for simple schema description
 - note collection
 - subnote collection
* *please create the following indexes for the "note" collection*
 - approveStatus (asc), datetime (desc)
 - party (asc), datetime (desc)
 - party (asc), type (asc), approveStatus (asc), datetime (desc)

### Folders & Files to take note of in /src/components/Note

All the files are an example of how the user can customize this vue-crud-x component

The files below shows the usual usage for a crud component

* config.js
 - crudOps object is where you can customise your crud operations, connection to DB, API, etc. The methods are find, findOne, create, update, delete, leave create, update, or delete null to disable their operation
 - crudTable object is where you specify the columns and how they are formatted
 - crudFilter object is where you specify the data involved in filtering, and the filename of the Vue file you created
 - crudForm object is where you specify what are the data the form operates on, and the filename of the Vue file you created

* NotesForm.vue
 - you customise how the form looks like here, take note of the button that leads you to next nested level of the crud

* NotesFilter.vue
 - you customise the search filters here

The files below are nested crud, with records retrieved based on parent Primary Key and other filter conditions

* configS.js
* NotesFormS.vue
* NotesFilterS.vue

The files below are to show that duplicate components can be created with different Form & Filter look and feel

* config2.js
* NotesForm2.vue
* NotesFilter2.vue

### Things to take note of in /src/router/index.js

Look at the routes and how the props are passed in

### Things to take note of in /src/App.vue

Look at menuItems and see the how the menu items and link to are done

### payload passed into methods created in crudOps

    find {
      pagination
      filterData
      addons {
        parentId: String
        jwtToken: JWT or some other token
        userId: String
      }
    }

    findOne {
      id: String
      addons: # see find method
    }

    update {
      record: # depends on how you describe it in object crudForm.defaultRec
      addons: # see find method
    }

    create {
      record: # depends on how you describe it in object crudForm.defaultRec
      addons: #see find method
    }

    delete {
      id: String
      addons:
    }

## schema

    note {
      id: String
      party: String
      type: String
      value: String
      approveStatus: String
      Approver: String
      datetime: String
    }

    subnote {
      id: String
      noteId: String
      info: String
      active: Boolean
    }

## Build Setup

### install dependencies
    npm install

### serve with hot reload at localhost:8080
    npm run dev

### build for production with minification
    npm run build

### build for production and view the bundle analyzer report
    npm run build --report

[//]: "[links](http://wikipedia.org)"

