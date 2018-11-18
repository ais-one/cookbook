module.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/",r(r.s=3)}([function(t,e){t.exports=require("@babel/runtime/regenerator")},function(t,e,r){},function(t,e){t.exports=require("lodash.clonedeep")},function(t,e,r){t.exports=r(5)},function(t,e,r){"use strict";var n=r(1);r.n(n).a},function(t,e,r){"use strict";r.r(e);var n=r(0),i=r.n(n),a=r(2),o=r.n(a);function s(t){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function c(t,e,r,n,i,a,o){try{var s=t[a](o),c=s.value}catch(t){return void r(t)}s.done?e(c):Promise.resolve(c).then(n,i)}function u(t){return function(){var e=this,r=arguments;return new Promise(function(n,i){var a=t.apply(e,r);function o(t){c(a,n,i,o,s,"next",t)}function s(t){c(a,n,i,o,s,"throw",t)}o(void 0)})}}var l={namespaced:!0,state:{records:[],totalRecs:0,record:{},pagination:{},filterData:{},defaultRec:{},crudOps:{export:null,find:null,delete:null,findOne:null,create:null,update:null}},getters:{record:function(t){return t.record},records:function(t){return t.records},totalRecs:function(t){return t.totalRecs},filterData:function(t){return t.filterData},pagination:function(t){return t.pagination},defaultRec:function(t){return t.defaultRec},crudOps:function(t){return t.crudOps}},mutations:{setRecords:function(t,e){t.records=e.records,t.totalRecs=e.totalRecs},setRecord:function(t,e){t.record=null===e?"function"==typeof t.defaultRec?t.defaultRec():o()(t.defaultRec):o()(e)},setPagination:function(t,e){t.pagination=e},setFilterData:function(t,e){t.filterData=e}},actions:{setPagination:function(t,e){(0,t.commit)("setPagination",e)},deleteRecord:function(){var t=u(i.a.mark(function t(e,r){var n,a;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.commit,n=e.getters,r.user=this.getters.user,t.next=4,n.crudOps.delete(r);case 4:return a=t.sent,t.abrupt("return",a);case 6:case"end":return t.stop()}},t,this)}));return function(e,r){return t.apply(this,arguments)}}(),getRecord:function(){var t=u(i.a.mark(function t(e,r){var n,a,o;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.commit,a=e.getters,r.user=this.getters.user,t.next=4,a.crudOps.findOne(r);case 4:o=t.sent,n("setRecord",o);case 6:case"end":return t.stop()}},t,this)}));return function(e,r){return t.apply(this,arguments)}}(),getRecords:function(){var t=u(i.a.mark(function t(e,r){var n,a,o,s,c,u;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.commit,a=e.getters,r.user=this.getters.user,t.next=4,a.crudOps.find(r);case 4:o=t.sent,s=o.records,c=o.pagination,u=r.doPage?c.totalItems:s.length,n("setPagination",c),n("setFilterData",r.filterData),n("setRecords",{records:s,totalRecs:u});case 11:case"end":return t.stop()}},t,this)}));return function(e,r){return t.apply(this,arguments)}}(),exportRecords:function(){var t=u(i.a.mark(function t(e,r){var n;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.commit,n=e.getters,r.user=this.getters.user,t.next=4,n.crudOps.export(r);case 4:case"end":return t.stop()}},t,this)}));return function(e,r){return t.apply(this,arguments)}}(),updateRecord:function(){var t=u(i.a.mark(function t(e,r){var n,a;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.commit,n=e.getters,r.user=this.getters.user,t.next=4,n.crudOps.update(r);case 4:return a=t.sent,t.abrupt("return",a);case 6:case"end":return t.stop()}},t,this)}));return function(e,r){return t.apply(this,arguments)}}(),createRecord:function(){var t=u(i.a.mark(function t(e,r){var n,a;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.commit,n=e.getters,e.dispatch,r.user=this.getters.user,t.next=4,n.crudOps.create(r);case 4:return a=t.sent,t.abrupt("return",a);case 6:case"end":return t.stop()}},t,this)}));return function(e,r){return t.apply(this,arguments)}}()}},d={props:{parentId:{type:String,default:null},storeName:{type:String,required:!0},crudFilter:{type:Object,required:!0},crudTable:{type:Object,required:!0},crudForm:{type:Object,required:!0},crudOps:{type:Object,required:!0}},created:function(){var t=u(i.a.mark(function t(){var e,r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e=this.$store,r=this.storeName,e&&e.state&&e.state[r]||(e.registerModule(r,o()(l)),e.state[r].defaultRec=this.crudForm.defaultRec,e.state[r].filterData=this.crudFilter.filterData,e.state[r].crudOps=this.crudOps),this.$options.filters.formatters=this.crudTable.formatters,this.crudTable.inline&&(this.inline=this.crudTable.inline),this.headers=this.crudTable.headers,this.actionColumn=-1!==this.headers.findIndex(function(t){return""===t.value}),this.saveRow=!!this.crudTable.saveRow&&this.crudTable.saveRow,this.inlineReload=Object.assign(this.inlineReload,this.crudTable.inlineReload||{}),this.formAutoData=this.isObject(this.crudForm.formAutoData)?this.crudForm.formAutoData:null,this.hasFormVue="function"==typeof this.crudForm.FormVue||this.formAutoData,this.hasFilterData=this.isObject(this.crudFilter.filterData),this.hasFilterVue="function"==typeof this.crudFilter.FilterVue,this.hasSummaryVue="function"==typeof this.crudTable.SummaryVue,this.addrowCreate=!!this.crudTable.addrowCreate&&this.crudTable.addrowCreate,this.onRowClickOpenForm=!1!==this.crudTable.onRowClickOpenForm,this.confirmCreate=!0===this.crudTable.confirmCreate,this.confirmUpdate=!0===this.crudTable.confirmUpdate,this.confirmDelete=!1!==this.crudTable.confirmDelete,this.doPage=!1!==this.crudTable.doPage,this.crudTitle=this.crudTable.crudTitle||"",this.showGoBack=!1!==this.crudTable.showGoBack,this.onCreatedOpenForm=!0===this.crudTable.onCreatedOpenForm,this.attrs=Object.assign(this.attrs,this.crudTable.attrs||{}),this.hasFilterVue&&(this.$options.components["crud-filter"]=this.crudFilter.FilterVue),this.hasFormVue&&(this.$options.components["crud-form"]=this.crudForm.FormVue),this.hasSummaryVue&&(this.$options.components["crud-summary"]=this.crudTable.SummaryVue),this.onCreatedOpenForm&&this.record.id&&(this.crudFormFlag=!0),this.isMounted=!1;case 29:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),mounted:function(){var t=u(i.a.mark(function t(){var e,r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if("function"!=typeof this.$t&&(this.$t=function(t){return t}),this.hasFilterVue){t.next=12;break}t.t0=i.a.keys(this.filterData);case 3:if((t.t1=t.t0()).done){t.next=12;break}if(e=t.t1.value,this.filterData[e].type&&(this.filterData[e].field=this.filterData[e].type),!this.filterData[e].attrs||!this.filterData[e].itemsFn){t.next=10;break}return t.next=9,this.filterData[e].itemsFn();case 9:this.filterData[e].attrs.items=t.sent;case 10:t.next=3;break;case 12:if(this.formAutoData)for(r in this.formAutoData)this.formAutoData[r].type&&(this.formAutoData[r].field=this.formAutoData[r].type);this.isMounted=!0;case 14:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),beforeUpdate:function(){this.hasFilterVue&&(this.$options.components["crud-filter"]=this.crudFilter.FilterVue),this.hasFormVue&&(this.$options.components["crud-form"]=this.crudForm.FormVue),this.hasSummaryVue&&(this.$options.components["crud-summary"]=this.crudTable.SummaryVue)},beforeRouteEnter:function(t,e,r){r(function(t){})},data:function(){return{crudFormFlag:!1,validForm:!0,onCreatedOpenForm:!1,onRowClickOpenForm:!0,hasFormVue:!1,formAutoData:null,validFilter:!0,hasFilterVue:!1,hasFilterData:!1,hasSummaryVue:!1,loading:!1,editing:null,inlineValue:null,headers:[],inline:!1,saveRow:!1,inlineReload:{create:!0,update:!0,delete:!0},actionColumn:!1,addrowCreate:!1,confirmCreate:!1,confirmUpdate:!1,confirmDelete:!0,doPage:!0,crudTitle:"",showGoBack:!1,selectControls:["v-autocomplete","v-switch","v-select","v-combobox","v-checkbox"],groupControls:["v-btn-toggle","v-radio-group"],attrs:{snackbar:{bottom:!0,timeout:6e3},container:{fluid:!0,class:"pa-2",style:{}},dialog:{fullscreen:!1,scrollable:!0,transition:"dialog-bottom-transition",overlay:!1},form:{class:"grey lighten-3 pa-2",style:{overflow:"auto"},"lazy-validation":!0},alert:{color:"grey",icon:""},toolbar:{height:48,dark:!1,light:!0,color:"grey",fixed:!1},table:{dark:!1,light:!0,"rows-per-page-items":[2,5,10,20],"hide-headers":!1,"loading-color":"primary",style:{"max-height":"calc(100vh - 144px)","overflow-y":"scroll","backface-visibility":"hidden"}},button:{dark:!1,light:!0,icon:!0,fab:!1},"v-progress-linear":{class:"ma-0"},"edit-indicator-left":"","edit-indicator-right":"","action-icon":{small:!0,class:"mr-1"}},showFilter:!1,showSummary:!1,snackbar:!1,snackbarText:""}},computed:{showTitle:function(){return this.crudTitle||this.storeName},records:function(){return this.$store.getters[this.storeName+"/records"]},totalRecs:function(){return this.$store.getters[this.storeName+"/totalRecs"]},filterData:function(){return this.$store.getters[this.storeName+"/filterData"]},record:function(){return this.$store.getters[this.storeName+"/record"]},pagination:{get:function(){var t={};try{t=this.$store.state[this.storeName].pagination}catch(t){}return t},set:function(t){this.setPagination(t)}},canCreate:function(){return this.can("create",this.crudOps.create&&(this.addrowCreate||this.hasFormVue||this.formAutoData))},canUpdate:function(){return this.can("update",this.crudOps.update&&(this.hasFormVue||this.formAutoData))},canDelete:function(){return this.can("delete",this.crudOps.delete)}},filters:{capitalize:function(t){return t?(t=t.toString()).charAt(0).toUpperCase()+t.slice(1):""}},watch:{loading:function(t,e){},pagination:{handler:function(){this.getRecordsHelper()},deep:!0},parentId:function(t){this.getRecordsHelper()}},methods:{can:function(t,e){if(this.$store.getters.user&&this.$store.getters.user.rules){var r=this.$store.getters.user.rules;return!((!r[this.storeName]||-1===r[this.storeName].indexOf(t)&&-1===r[this.storeName].indexOf("*"))&&(!r["*"]||-1===r["*"].indexOf(t)&&-1===r["*"].indexOf("*")))&&e}return e},isObject:function(t){return null!==t&&"object"===s(t)},setSnackBar:function(t){this.attrs.snackbar&&t&&(this.snackbarText=this.$t("vueCrudX.unknownOperation"),200===t||201===t?this.snackbarText=this.$t("vueCrudX.operationOk"):500===t?this.snackbarText=this.$t("vueCrudX.operationError"):409===t&&(this.snackbarText=this.$t("vueCrudX.duplicateError")),this.snackbar=!0)},getRecords:function(){var t=u(i.a.mark(function t(e){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch(this.storeName+"/getRecords",e);case 2:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),setPagination:function(t){this.$store.dispatch(this.storeName+"/setPagination",t)},deleteRecord:function(){var t=u(i.a.mark(function t(e){var r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.loading=!0,t.next=3,this.$store.dispatch(this.storeName+"/deleteRecord",e);case 3:return r=t.sent,this.$emit("deleted",200===r?e:null),this.loading=!1,this.setSnackBar(r),t.abrupt("return",200===r);case 8:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),updateRecord:function(){var t=u(i.a.mark(function t(e){var r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.loading=!0,t.next=3,this.$store.dispatch(this.storeName+"/updateRecord",e);case 3:return r=t.sent,this.$emit("updated",200===r?e:null),this.loading=!1,this.setSnackBar(r),t.abrupt("return",200===r);case 8:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),createRecord:function(){var t=u(i.a.mark(function t(e){var r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.loading=!0,t.next=3,this.$store.dispatch(this.storeName+"/createRecord",e);case 3:return r=t.sent,this.$emit("created",201===r?e:null),this.loading=!1,this.setSnackBar(r),t.abrupt("return",201===r);case 8:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),getRecord:function(){var t=u(i.a.mark(function t(e){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.loading=!0,t.next=3,this.$store.dispatch(this.storeName+"/getRecord",e);case 3:this.loading=!1;case 4:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),setRecord:function(t){this.$store.commit(this.storeName+"/setRecord",null)},exportRecords:function(){var t=u(i.a.mark(function t(e){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch(this.storeName+"/exportRecords",e);case 2:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),closeCrudForm:function(){this.setRecord(),this.crudFormFlag=!1,this.$emit("form-close")},crudFormOpen:function(){var t=u(i.a.mark(function t(e){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=5;break}return t.next=3,this.getRecord({id:e});case 3:t.next=6;break;case 5:this.setRecord();case 6:this.crudFormFlag=!0;case 7:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),crudFormSave:function(){var t=u(i.a.mark(function t(e){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(this.record.id||!this.confirmCreate){t.next=3;break}if(confirm(this.$t("vueCrudX.confirm"))){t.next=3;break}return t.abrupt("return");case 3:if(!this.record.id||!this.confirmUpdate){t.next=6;break}if(confirm(this.$t("vueCrudX.confirm"))){t.next=6;break}return t.abrupt("return");case 6:if(!this.record.id){t.next=11;break}return t.next=9,this.updateRecord({record:this.record});case 9:t.next=13;break;case 11:return t.next=13,this.createRecord({record:this.record,parentId:this.parentId});case 13:return t.next=15,this.getRecordsHelper();case 15:this.closeCrudForm();case 16:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),crudFormDelete:function(){var t=u(i.a.mark(function t(e){var r;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.confirmDelete){t.next=3;break}if(confirm(this.$t("vueCrudX.confirm"))){t.next=3;break}return t.abrupt("return");case 3:if(!(r=this.record.id)){t.next=9;break}return t.next=7,this.deleteRecord({id:r});case 7:return t.next=9,this.getRecordsHelper();case 9:this.closeCrudForm();case 10:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),getRecordsHelper:function(){var t=u(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.loading=!0,t.next=3,this.getRecords({doPage:this.doPage,pagination:this.pagination,filterData:this.filterData,parentId:this.parentId});case 3:this.loading=!1;case 4:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),submitFilter:function(){var t=u(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.saveRow&&this.clearEditing(),t.next=3,this.getRecordsHelper();case 3:this.$emit("loaded",Date.now());case 4:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),exportBtnClick:function(){var t=u(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return this.loading=!0,t.next=3,this.exportRecords({pagination:this.pagination,filterData:this.filterData,parentId:this.parentId});case 3:this.loading=!1;case 4:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),goBack:function(){this.$router.back()},isEditing:function(t){return t?!(!this.editing||!this.editing[t]):this.editing},setEditing:function(t,e){this.$refs["edit-".concat(t)].style["background-color"]=this.saveRow,null===this.editing&&(this.editing={}),this.editing[t]={item:e,ts:Date.now()}},clearEditing:function(t){if(void 0!==t)this.editing&&this.editing[t]&&(this.$refs["edit-".concat(t)].style["background-color"]="",delete this.editing[t],0===Object.keys(this.editing).length&&(this.editing=null));else{for(var e=0;e<this.records.length;e++)this.$refs["edit-".concat(e)].style["background-color"]="";this.editing=null}},inlineOpen:function(t,e,r){if(this.inlineValue=t,void 0!==e&&void 0!==r){var n=this.$refs["edit-".concat(e,"-").concat(r)][0];this.$nextTick(function(){var t=n.$children[0].$children[0].$children[0];"v-textarea"===t.$options._componentTag&&setTimeout(function(){return t.focus()},50)})}},inlineClose:function(){var t=u(i.a.mark(function t(e,r,n,a){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:r&&e[r]===this.inlineValue||r&&this.saveRow&&this.setEditing(n,e);case 1:case"end":return t.stop()}},t,this)}));return function(e,r,n,i){return t.apply(this,arguments)}}(),inlineUpdate:function(){var t=u(i.a.mark(function t(e,r,n,a){var o,s,c;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(r&&e[r]===this.inlineValue){t.next=11;break}if(!r||!this.saveRow){t.next=5;break}this.setEditing(n,e),t.next=11;break;case 5:if(!this.saveRow||this.isEditing(n)){t.next=7;break}return t.abrupt("return");case 7:return t.next=9,this.updateRecord({record:e});case 9:t.sent?(this.saveRow&&this.clearEditing(n),this.inlineReload.update&&this.$nextTick(u(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.getRecordsHelper();case 2:case"end":return t.stop()}},t,this)})))):this.saveRow||(e[r]=this.inlineValue);case 11:if(void 0!==n&&void 0!==a&&(o=this.$refs["edit-".concat(n,"-").concat(a)]&&this.$refs["edit-".concat(n,"-").concat(a)][0]?this.$refs["edit-".concat(n,"-").concat(a)][0]:null)){s=null;try{s=o.$children[0].$children[0].$children[0]}catch(t){}s&&("v-date-picker"!==(c=s.$options._componentTag)&&"v-time-picker"!==c&&"v-textarea"!==c||o.save(e[r]))}case 12:case"end":return t.stop()}},t,this)}));return function(e,r,n,i){return t.apply(this,arguments)}}(),inlineCancel:function(){var t=u(i.a.mark(function t(e,r){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:void 0!==e&&void 0!==r&&this.$refs["edit-".concat(e,"-").concat(r)][0].cancel();case 1:case"end":return t.stop()}},t,this)}));return function(e,r){return t.apply(this,arguments)}}(),inlineCreate:function(){var t=u(i.a.mark(function t(){var e,r,n,a,o,s;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e="function"==typeof this.crudForm.defaultRec?this.crudForm.defaultRec():this.crudForm.defaultRec,!this.saveRow){t.next=4;break}if(!this.isEditing()){t.next=4;break}return t.abrupt("return",alert(this.$t("vueCrudX.pleaseSave")));case 4:r=0;case 5:if(!(r<this.addrowCreate.length)){t.next=16;break}if(n=this.addrowCreate[r],a=n.field,o=n.label,!(s=prompt(o,e[a]))){t.next=12;break}e[a]=s,t.next=13;break;case 12:return t.abrupt("return");case 13:r++,t.next=5;break;case 16:if(!this.confirmCreate){t.next=19;break}if(confirm(this.$t("vueCrudX.confirm"))){t.next=19;break}return t.abrupt("return");case 19:return t.next=21,this.createRecord({record:e,parentId:this.parentId});case 21:this.inlineReload.create&&this.$nextTick(u(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.getRecordsHelper();case 2:case"end":return t.stop()}},t,this)})));case 22:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),inlineDelete:function(){var t=u(i.a.mark(function t(e){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.confirmDelete){t.next=3;break}if(confirm(this.$t("vueCrudX.confirm"))){t.next=3;break}return t.abrupt("return");case 3:return t.next=5,this.deleteRecord({id:e});case 5:this.inlineReload.delete&&this.$nextTick(u(i.a.mark(function t(){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.getRecordsHelper();case 2:case"end":return t.stop()}},t,this)})));case 6:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),rowClicked:function(t,e,r){!this.actionColumn&&this.onRowClickOpenForm&&this.crudFormOpen(t.id),this.inline||this.$emit("selected",{item:t,event:e})},testFunction:function(){var t=u(i.a.mark(function t(e){return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:console.log(e);case 1:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}()}};r(4);var f=function(t,e,r,n,i,a,o,s){var c,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=r,u._compiled=!0),n&&(u.functional=!0),a&&(u._scopeId="data-v-"+a),o?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},u._ssrRegister=c):i&&(c=s?function(){i.call(this,this.$root.$options.shadowRoot)}:i),c)if(u.functional){u._injectStyles=c;var l=u.render;u.render=function(t,e){return c.call(e),l(t,e)}}else{var d=u.beforeCreate;u.beforeCreate=d?[].concat(d,c):[c]}return{exports:t,options:u}}(d,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",t._b({},"v-container",t.attrs.container,!1),[r("v-toolbar",t._b({},"v-toolbar",t.attrs.toolbar,!1),[r("v-toolbar-title",[t.parentId&&t.showGoBack?r("v-btn",t._b({attrs:{disabled:t.loading},on:{click:function(e){return e.stopPropagation(),t.goBack(e)}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v("reply")])],1):t._e(),t._v(" "+t._s(t._f("capitalize")(t.showTitle))+" "+t._s(t.doPage?"":" ("+t.records.length+")"))],1),t._v(" "),t.hasSummaryVue?r("v-btn",t._b({attrs:{disabled:t.loading},on:{click:function(e){t.showSummary=!t.showSummary}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v(t._s(t.showSummary?"keyboard_arrow_up":"list"))])],1):t._e(),t._v(" "),r("v-spacer"),t._v(" "),r("v-btn",t._b({attrs:{disabled:!t.hasFilterData},on:{click:function(e){t.showFilter=!t.showFilter}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v(t._s(t.showFilter?"keyboard_arrow_up":"search"))])],1),t._v(" "),r("v-btn",t._b({attrs:{disabled:!t.validFilter||t.loading},on:{click:t.submitFilter}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v("replay")])],1),t._v(" "),t.canCreate?r("v-btn",t._b({attrs:{disabled:t.loading},on:{click:function(e){e.stopPropagation(),t.addrowCreate?t.inlineCreate():t.crudFormOpen(null)}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v("add")])],1):t._e(),t._v(" "),t.crudOps.export?r("v-btn",t._b({attrs:{disabled:t.loading},on:{click:function(e){return e.stopPropagation(),t.exportBtnClick(e)}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v("print")])],1):t._e()],1),t._v(" "),t.showFilter?r("div",[t.hasFilterData?r("v-form",t._b({ref:"searchForm",model:{value:t.validFilter,callback:function(e){t.validFilter=e},expression:"validFilter"}},"v-form",t.attrs.form,!1),[t.hasFilterVue?r("crud-filter",{attrs:{filterData:t.filterData,parentId:t.parentId,storeName:t.storeName,vueCrudX:t._self}}):r("v-layout",{attrs:{row:"",wrap:""}},t._l(t.filterData,function(e,n){return r("v-flex",{key:n,attrs:{sm6:e.halfSize,xs12:""}},[r(e.field,t._b({tag:"component",model:{value:e.value,callback:function(r){t.$set(e,"value",r)},expression:"filter.value"}},"component",e.attrs,!1),["v-btn-toggle"===e.field?t._l(e.group.items,function(n,i,a){return r("v-btn",t._b({key:a,tag:"component",attrs:{value:i}},"component",e.group.attrs,!1),[t._v(t._s(n))])}):"v-radio-group"===e.field?t._l(e.group.items,function(n,i,a){return r("v-radio",t._b({key:a,tag:"component",attrs:{value:i,label:n}},"component",e.group.attrs,!1))}):t._e()],2)],1)}))],1):t._e()],1):t._e(),t._v(" "),r("v-data-table",t._b({attrs:{headers:t.headers,items:t.records,"total-items":t.totalRecs,pagination:t.pagination,loading:!!t.loading&&t.attrs.table["loading-color"],"hide-actions":!t.doPage},on:{"update:pagination":function(e){t.pagination=e}},scopedSlots:t._u([{key:"headerCell",fn:function(e){return[r("span",{domProps:{innerHTML:t._s(e.header.text)}})]}},{key:"items",fn:function(e){return[r("tr",{ref:"edit-"+e.index,on:{click:function(r){r.stopPropagation(),t.rowClicked(e.item,r,e.index)}}},t._l(t.headers,function(n,i){return r("td",{key:n.value,class:n["cell-class"]?n["cell-class"]:n.class},[""===n.value?r("span",[t.canUpdate&&!t.saveRow?r("v-icon",t._b({attrs:{disabled:t.loading},on:{click:function(r){r.stopPropagation(),t.crudFormOpen(e.item.id)}}},"v-icon",t.attrs["action-icon"],!1),[t._v("edit")]):t._e(),t._v(" "),t.canDelete?r("v-icon",t._b({attrs:{disabled:t.loading},on:{click:function(r){r.stopPropagation(),t.inlineDelete(e.item.id)}}},"v-icon",t.attrs["action-icon"],!1),[t._v("delete")]):t._e(),t._v(" "),t.canUpdate&&t.saveRow?r("v-icon",t._b({attrs:{disabled:t.loading},on:{click:function(r){r.stopPropagation(),t.inlineUpdate(e.item,null,e.index,i)}}},"v-icon",t.attrs["action-icon"],!1),[t._v("save")]):t._e()],1):t._e(),t._v(" "),t.inline[n.value]?"v-date-picker"===t.inline[n.value].field||"v-time-picker"===t.inline[n.value].field||"v-textarea"===t.inline[n.value].field?r("v-edit-dialog",{ref:"edit-"+e.index+"-"+i,refInFor:!0,attrs:{"return-value":e.item[n.value],large:t.inline[n.value].buttons,persistent:!1,"cancel-text":t.$t("vueCrudX.cancel"),"save-text":t.$t("vueCrudX.save"),lazy:""},on:{"update:returnValue":function(r){t.$set(e.item,n.value,r)},save:function(r){!t.saveRow&&t.inlineUpdate(e.item,n.value,e.index,i)},cancel:function(){},open:function(r){t.inlineOpen(e.item[n.value],e.index,i)},close:function(){}}},[r("div",[t._v(t._s(t.attrs["edit-indicator-left"])+t._s(e.item[n.value])+t._s(t.attrs["edit-indicator-right"]))]),t._v(" "),r(t.inline[n.value].field,t._b({tag:"component",attrs:{slot:"input"},on:{input:function(r){"v-textarea"!==t.inline[n.value].field&&t.inlineUpdate(e.item,n.value,e.index,i)},blur:function(r){"v-textarea"===t.inline[n.value].field?t.inlineUpdate(e.item,n.value,e.index,i):t.inlineClose(e.item,n.value,e.index,i)}},slot:"input",model:{value:e.item[n.value],callback:function(r){t.$set(e.item,n.value,r)},expression:"props.item[header.value]"}},"component",t.inline[n.value].attrs,!1))],1):-1!==t.groupControls.indexOf(t.inline[n.value].field)?r(t.inline[n.value].field,t._b({ref:"edit-"+e.index+"-"+i,refInFor:!0,tag:"component",on:{change:function(r){t.inlineUpdate(e.item,n.value,e.index,i)}},model:{value:e.item[n.value],callback:function(r){t.$set(e.item,n.value,r)},expression:"props.item[header.value]"}},"component",t.inline[n.value].attrs,!1),["v-btn-toggle"===t.inline[n.value].field?t._l(t.inline[n.value].group.items,function(e,i,a){return r("v-btn",t._b({key:a,tag:"component",attrs:{value:i,label:e}},"component",t.inline[n.value].group.attrs,!1))}):"v-radio-group"===t.inline[n.value].field?t._l(t.inline[n.value].group.items,function(e,i,a){return r("v-radio",t._b({key:a,tag:"component",attrs:{value:i,label:e}},"component",t.inline[n.value].group.attrs,!1))}):t._e()],2):r(t.inline[n.value].field,t._b({ref:"edit-"+e.index+"-"+i,refInFor:!0,tag:"component",on:{focus:function(r){t.inlineOpen(e.item[n.value])},blur:function(r){-1===t.selectControls.indexOf(t.inline[n.value].field)&&t.inlineUpdate(e.item,n.value,e.index,i)},change:function(r){-1!==t.selectControls.indexOf(t.inline[n.value].field)&&t.inlineUpdate(e.item,n.value,e.index,i)}},model:{value:e.item[n.value],callback:function(r){t.$set(e.item,n.value,r)},expression:"props.item[header.value]"}},"component",t.inline[n.value].attrs,!1)):r("span",{domProps:{innerHTML:t._s(t.$options.filters.formatters(e.item[n.value],n.value))}})],1)}))]}}])},"v-data-table",t.attrs.table,!1),[r("template",{slot:"no-data"},[r("v-flex",{staticClass:"text-xs-center"},[r("v-alert",t._b({attrs:{value:!0}},"v-alert",t.attrs.alert,!1),[r("v-icon",[t._v("warning")]),t._v(" "+t._s(t.$t?t.$t("vueCrudX.noData"):"NO DATA"))],1)],1)],1)],2),t._v(" "),t.showSummary?r("div",[t.hasSummaryVue?r("crud-summary",{attrs:{records:t.records,parentId:t.parentId,storeName:t.storeName}}):t._e()],1):t._e(),t._v(" "),r("v-layout",{attrs:{row:"","justify-center":""}},[r("v-dialog",t._b({model:{value:t.crudFormFlag,callback:function(e){t.crudFormFlag=e},expression:"crudFormFlag"}},"v-dialog",t.attrs.dialog,!1),[r("v-card",[r("v-toolbar",t._b({},"v-toolbar",t.attrs.toolbar,!1),[r("v-toolbar-title",[r("v-btn",t._b({attrs:{disabled:t.loading},nativeOn:{click:function(e){return t.closeCrudForm(e)}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v("close")])],1),t._v(" "+t._s(t._f("capitalize")(t.showTitle)))],1),t._v(" "),r("v-spacer"),t._v(" "),r("v-toolbar-items",[t.canDelete&&t.record.id?r("v-btn",t._b({attrs:{disabled:t.loading},nativeOn:{click:function(e){return t.crudFormDelete(e)}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v("delete")])],1):t._e(),t._v(" "),t.canUpdate&&t.record.id||t.canCreate&&!t.record.id?r("v-btn",t._b({attrs:{disabled:!t.validForm||t.loading},nativeOn:{click:function(e){return t.crudFormSave(e)}}},"v-btn",t.attrs.button,!1),[r("v-icon",[t._v("save")])],1):t._e()],1)],1),t._v(" "),r(t.attrs["v-progress-circular"]?"v-progress-circular":"v-progress-linear",t._b({tag:"component",attrs:{indeterminate:t.loading}},"component",t.attrs["v-progress-circular"]?t.attrs["v-progress-circular"]:t.attrs["v-progress-linear"],!1)),t._v(" "),t.hasFormVue?r("v-form",t._b({model:{value:t.validForm,callback:function(e){t.validForm=e},expression:"validForm"}},"v-form",t.attrs.form,!1),[t.formAutoData?r("v-layout",{attrs:{row:"",wrap:""}},t._l(t.formAutoData,function(e,n,i){return r("v-flex",{key:i,attrs:{sm6:e.halfSize,xs12:""}},["hidden"===e.field?r("div",{tag:"component"}):void 0!==t.record[n]?r(e.field,t._b({tag:"component",model:{value:t.record[n],callback:function(e){t.$set(t.record,n,e)},expression:"record[objKey]"}},"component",e.attrs,!1),["v-btn-toggle"===e.field?t._l(e.group.items,function(n,i,a){return r("v-btn",t._b({key:a,tag:"component",attrs:{value:i}},"component",e.group.attrs,!1),[t._v(t._s(n))])}):"v-radio-group"===e.field?t._l(e.group.items,function(n,i,a){return r("v-radio",t._b({key:a,tag:"component",attrs:{value:i,label:n}},"component",e.group.attrs,!1))}):t._e()],2):t._e()],1)})):r("crud-form",{attrs:{record:t.record,parentId:t.parentId,storeName:t.storeName,vueCrudX:t._self}})],1):t._e()],1)],1)],1),t._v(" "),t.attrs.snackbar?r("v-snackbar",t._b({model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},"v-snackbar",t.attrs.snackbar,!1),[t._v("\n    "+t._s(t.snackbarText)+"\n    "),r("v-btn",{attrs:{fab:"",flat:""},on:{click:function(e){t.snackbar=!1}}},[r("v-icon",[t._v("close")])],1)],1):t._e()],1)},[],!1,null,"d189a1be",null);f.options.__file="VueCrudX.vue";e.default=f.exports}]);