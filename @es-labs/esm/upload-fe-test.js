const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export function clear (hello) {
  console.log('upload-fe:' + hello)
}

export async function enableCorsGoogle () {
  alert('USE: gsutil cors set [JSON_FILE_NAME].json gs://[BUCKET_NAME]')
}

export async function readGoogle (filename) {
  try {

  } catch (e) {

  }
  const res = await fetch('/api/gcp-sign', {
      method: 'POST',
      headers,
      body: JSON.stringify({ filename, action: 'read' })
  })
  const rv = await res.json()
  const res2 = await fetch(rv.url, { method: 'GET' })

  const decoder = new TextDecoder('utf-8')
  fetch(rv.url, { method: 'GET' }).then(response => {
    response.body
      .getReader()
      .read()
      .then(({value, done}) => {
        console.log(done, "boo", decoder.decode(value))
      })
  })
  // const xxx = await res2.body.getReader().read()
  // console.log(xxx)
  // alert('Google Read: ' + (res2.ok) ? 'OK' : 'FAIL') 
}

export async function deleteGoogle (filename) {
  try {
    const res = await fetch(`/api/gcp-sign`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ filename, action: 'delete' })
    })
    const rv = await res.json()
    const res2 = await fetch(rv.url, { method: 'DELETE' })
    // console.log(res2)
    alert('Google Delete: ' + (res2.ok) ? 'OK' : 'FAIL') 
  } catch (e) {
    alert('Google Delete: ' + e.toString())
  }
}

export async function uploadGoogle (files) {
  // TBD limit upload size
  if (files && files.length) {
  }
  try {
    const file = files[0] // TBD handle multiple files
    const filename = file.name
    const res = await fetch(`/api/gcp-sign`, { method: 'POST', headers, body: JSON.stringify({ filename, action: 'write' }) })
    const rv = await res.json()
    const res2 = await fetch(rv.url, { method: 'PUT', body: files[0],  headers: { 'Content-Type': 'application/octet-stream' } })
    alert('Google Upload: ' + (res2.ok) ? 'OK' : 'FAIL') 
  } catch (e) {
    alert('Google Upload: ' + e.toString())
  }
}

export async function uploadMemory(files) {
  try {
    const formData = new FormData()
    formData.append('memory', files[0])
    const res = await fetch('/api/upload-memory', { method: 'POST', body: formData })
    const rv = await res.json()
    console.log(rv)
  } catch (e) {
    console.log(e)
  }
}

export async function uploadFiles(files) {
  try {
    const formData = new FormData()
    for (const file of files) {
      const ext = file.name.split('.').pop()
      // console.log(ext, typeof file, file)
      formData.append(ext, file, file.name)
    }
    // console.log(files)
    formData.append('json-data1', JSON.stringify({ name: 'name', age: 25 }))
    formData.append('json-data2', JSON.stringify({ name: 'name2', age: 35 }))
    const res = await fetch('/api/upload-disk', { method: 'POST', body: formData })
    const rv = await res.json()
    // console.log(rv)
    return rv
  } catch (e) {
    // console.log(e)
    return e
  }
}

export async function jsonOnly() {
  await fetch('/api/upload-disk', {
    method: 'POST',
    headers: {
      // 'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ jsonName: 'aa', jsonAge: 5 }) 
  })
}
