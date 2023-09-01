const fs = require("fs");
const { parse } = require("csv-parse");

// year_month,month_of_release,passenger_type,direction,sex,age,estimate,standard_error,status
// 2001-01,2020-09,Long-term migrant,Arrivals,Female,0-4 years,344,0,Final
// 2001-01,2020-09,Long-term migrant,Arrivals,Male,0-4 years,341,0,Final

fs.createReadStream("./test.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log(row);
  })
  .on("end", function () {
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });