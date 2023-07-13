const testString = [
  {
    a: 1,
    b: "n1,n2",
    c: true,
    d: new Date(),
    e: {
      e1: "Hello \"World\" 1",
      e2: [1, 2, "4"]
    },
    f: "bl,ah = 24\""
  },
  {
    a: 2,
    b: "k1,k2",
    d: new Date(),
    c: false,
    e: {
      e3: () => [1, 2, "4"]
    },
    f: "bl,aba,\"h = 24\""
  }
]

// a,b,c,d,e,f
// "1","n1,n2","true","2023-04-06T23:43:13.325Z",{"e1":"Hello \"World\" 1","e2":[1,2,"4"]},"bl,ah = 24""
// "2","k1,k2","2023-04-06T23:43:13.325Z","false",{},"bl,aba,"h = 24""


// causing problems ( ", )
// a,b,c
// "asd","123",11
// "a",sd","12,,"3",""\"=".\""3"

// [
//   {
//     "a": "asd",
//     "b": "123",
//     "c": "11"
//   },
//   {
//     "a": "a",
//     "b": "sd\"",
//     "c": "12,,\"3",
//     "__parsed_extra": [
//       "\"\\\"=\".\\\"3"
//     ]
//   }
// ]


// string.replace(/\"/g, "\"\"")

function json2csv(_json) {
  let csv = ''
  if (Array.isArray(_json)) _json.forEach((row, index) => {
    if (index === 0) {
      const keys = Object.keys(row).join(',')
      console.log(keys)
    }
    const vals = Object.values(row).map((col) => { // TBD escaping
      if (typeof col === 'object') return JSON.stringify(col)
      else return `"${col.toString()}"`
    })
    const valStr = vals.join(',')
    console.log(valStr)
  })
  return csv
}

json2csv(testString)

// export default json2csv
