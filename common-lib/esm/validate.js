// type: string, date, datetime, time, integer, float
// {
//   rules: {
//     min: 0, // string, date, datetime, time, integer, float
//     max: 10, // string, date, datetime, time, integer, float
//     regex: 10, // string
//     gt: 'field', // date, datetime, time, integer, float
//     gte: 'field', // date, datetime, time, integer, float
//     lt: 'field', // date, datetime, time, integer, float
//     lte: 'field', // date, datetime, time, integer, float
//     dec: 2 // float
//   ]
// }

// TBD i18n
// for use with
// - example-app/router/t4t.js
// - example-vite/src/components/CrudTable.vue
function validate(rules, type, col, record) {
  let invalid = ''
  for (const rule in rules) {
    if (type === 'string') {
      if (rule === 'min' && record[col].length < rules[rule]) invalid = `need at least ${rules[rule]} characters`
      else if (rule === 'max' && record[col].length > rules[rule]) invalid = `maximum ${rules[rule]} characters`
      else if (rule === 'regex' && !RegExp(rules[rule]).test(record[col])) invalid = `regex ${rules[rule]} failed`
    } else if (['integer', 'decimal', 'datetime', 'date', 'time'].includes(type)) {
      if (rule === 'min' && record[col] < rules[rule]) invalid = `cannot be less than ${rules[rule]}`
      else if (rule === 'max' && record[col] > rules[rule]) invalid = `cannot be more than ${rules[rule]}`
      else if (rule === 'gt' && record[rules[rule]] && !(record[col] > record[rules[rule]])) invalid = `${col} must be > ${rules[rule]}`
      else if (rule === 'gte' && record[rules[rule]] && !(record[col] >= record[rules[rule]])) invalid = `${col} must be >= ${rules[rule]}`
      else if (rule === 'lt' && record[rules[rule]] && !(record[col] < record[rules[rule]])) invalid = `${col} must be < ${rules[rule]}`
      else if (rule === 'lte' && record[rules[rule]] && !(record[col] <= record[rules[rule]])) invalid = `${col} must be <= ${rules[rule]}`
    } else {
      // nothing here...
    }
    if (invalid) break
  }
  return invalid
}

export { validate }
