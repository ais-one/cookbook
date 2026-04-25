import Fetch from './fetch.js';

let tableName = '';
let parentFilter = null;
let config = null;
let urlPrefix = '/api';
let http = new Fetch();
// Do Not Catch Errors - let it be caught by caller

function setTableName(name) {
  // set table name
  tableName = name;
  parentFilter = null; // TODO: find a more sustainable way using prototype or let caller handle this part
}

// this might change
const setFetch = _fetch => (http = _fetch); // set the fetch function
const setParentFilter = _filter => (parentFilter = _filter);
const setUrlPrefix = _urlPrefix => (urlPrefix = _urlPrefix);

async function getConfig() {
  const { data } = await http.get(`${urlPrefix}/t4t/config/${tableName}`);
  if (data) config = data;
  return data;
}

async function find(filters, sorter, page, limit) {
  const rv = {
    results: [],
    total: 0,
  };
  if (parentFilter) {
    filters.push({ col: parentFilter.col, op: '=', val: parentFilter.id, andOr: 'and' });
  }
  filters = filters ? JSON.stringify(filters) : ''; // [{col, op, val, andOr}, ...]
  sorter = sorter ? JSON.stringify(sorter) : ''; // [{ column: '<col_name>', order: 'asc|desc' }, ...]
  const { data } = await http.get(`${urlPrefix}/t4t/find/${tableName}`, {
    page,
    limit,
    filters,
    sorter,
  });
  rv.results = data.results;
  rv.total = data.total;
  return rv;
}

async function download(filters, sorter) {
  const { data } = await http.get(`${urlPrefix}/t4t/find/${tableName}`, {
    page: 0,
    limit: 0,
    filters: filters ? JSON.stringify(filters) : '',
    sorter: sorter ? JSON.stringify(sorter) : '',
    csv: 1, // it is a csv
  });
  return data;
}

async function findOne(__key) {
  let rv = {};
  const { data } = await http.get(`${urlPrefix}/t4t/find-one/${tableName}`, { __key }); // if multiKey, then seperate values by |, column is implied by order
  if (data) {
    rv = data;
    rv.__key = __key;
  }
  return rv;
}

// process data for use with
// JSON only,  multi-part form, JSON & filelist (signed URL upload)
function processData(record, { signedUrl = false } = {}) {
  const rv = {
    json: {},
  };
  for (const [k, v] of Object.entries(record)) {
    if (v instanceof FileList) {
      const fileNameArray = [];
      for (const file of v) {
        if (signedUrl) {
          if (!rv.files) rv.files = [];
          rv.files.push(file);
        } else {
          if (!rv.form) rv.form = new FormData();
          rv.form.append('file-data', file); // add
        }
        fileNameArray.push(file.name);
      }
      rv.json[k] = fileNameArray.join(','); // array
    } else {
      rv.json[k] = v;
    }
  }
  if (rv.form) rv.form.append('json-data', JSON.stringify(rv.json)); // set the JSON
  return rv;
}

async function create(record) {
  // const { data } = await http.patch(`/authors/${id}`, formData,
  //   { onUploadProgress: progressEvent => console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + '%') } // axios only
  // )
  return await http.post(`${urlPrefix}/t4t/create/${tableName}`, record);
}

async function update(__key, record, headers = null) {
  return await http.patch(`${urlPrefix}/t4t/update/${tableName}`, record, { __key }, headers);
}

// Handle file removals seperately
async function remove(items) {
  // console.log(items)
  let ids = [];
  // const { pk } = config
  // ids = pk ? items.map((item) => item[pk]) : items.map((item) => item.__key)
  // console.log(ids)
  ids = items;
  return await http.post(`${urlPrefix}/t4t/remove/${tableName}`, { ids });
}

// uploads a single csv for batch processing
async function upload(file) {
  // the file object
  // TODO add exception handling
  if (file === null) return false;
  const formData = new FormData();
  formData.append('csv-file', file); // call it file
  // console.log('zzz', formData instanceof FormData)
  // for(const pair of formData.entries()) console.log(pair[0], pair[1])
  return await http.post(`${urlPrefix}/t4t/upload/${tableName}`, formData);
  // formData.append('textdata', JSON.stringify({ name: 'name', age: 25 }))
  // const res = await fetch('/api/upload', { method: 'POST', body: formData })
  // const { id, name, avatar } = record
  // const json = JSON.stringify({ name })
  // // const blob = new Blob([json], { type: 'application/json' })
  // // console.log('json', blob)
}

// const autoComplete = debounce(async (e, col, _showForm) => {
// recordObj[_showForm][col] = e.target.value

// wrap in debounce
// parentColVal in use-cases where parent table column changes
async function autocomplete(search, col, record, parentColVal = '') {
  let res = [];
  try {
    const { tableName, limit, key, text, parentTableColName, parentCol } = config.cols[col].options;
    const query = { tableName, limit, key, text, search };
    let parentTableColVal = '';
    if (parentTableColName) {
      parentTableColVal = parentColVal || record[parentCol] || '';
    }
    const { data } = await http.post(`${urlPrefix}/t4t/autocomplete/${tableName}`, {
      key,
      text,
      search,
      limit,
      parentTableColName,
      parentTableColVal,
    });
    res = data;
  } catch (err) {
    // TODO console.log('autocomplete', err.message)
  }
  return res;
}

export {
  autocomplete,
  create,
  download,
  find,
  findOne,
  getConfig,
  processData,
  remove,
  setFetch,
  setParentFilter,
  setTableName,
  setUrlPrefix,
  update,
  upload,
};
