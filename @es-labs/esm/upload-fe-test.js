const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export async function readGoogle (filename) {
  try {
    const res = await fetch('/api/gcp-sign', {
      method: 'POST',
      headers,
      body: JSON.stringify({ filename, action: 'read' })
    })
    const rv = await res.json()
    if (rv.url) {
      const decoder = new TextDecoder('utf-8')
      const res2 = await fetch(rv.url, { method: 'GET' })
      if (res2.ok) {
        const data = await res2.body.getReader().read()
        // TBD why is data.done always false?
        console.log(decoder.decode(data.value))
        alert('readGoogle() OK - see console log for data')
      } else {
        alert('readGoogle() OK === false')
      }
      // NOSONAR another option
      // fetch(rv.url, { method: 'GET' }).then(response => {
      //   response.body
      //     .getReader()
      //     .read()
      //     .then(({value, done}) => {
      //       console.log(done, "boo", decoder.decode(value)) // TBD why is done always false?
      //     })
      // })
    } else {
      alert('readGoogle() gcp-sign error: ' + (rv.error || 'Some Error'))
    }
  } catch (e) {
    alert('ERROR: readGoogle() :' + e.toString())
  }
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
    console.log(res2)
    alert(`Google Delete: ${res2.ok ? 'OK' : 'FAIL'}`) 
  } catch (e) {
    alert('Google Delete: ' + e.toString())
  }
}

export async function uploadGoogle (files) {
  if (!files || files.length === 0) {
    alert('Google Upload:: No Files') // TBD limit file quantity and size
    return
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
    return await res.json()
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
