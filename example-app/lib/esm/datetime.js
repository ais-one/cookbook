export function dateISO(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substring(0, 10)
}

export function timeISO(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substring(11, 22)
}

export function dateStrAddDay(dateStr, days = 0) {
  const d = new Date(Date.parse(dateStr) - new Date().getTimezoneOffset())
  d.setDate(d.getDate() + days) // add the days
  return [d.getFullYear().toString(), (d.getMonth() + 1).toString().padStart(2, 0), d.getDate().toString().padStart(2, 0)]
}
