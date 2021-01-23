const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export function clear (hello) {
  console.log('gcp-upload:' + hello)
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
    const res = await fetch(`/api/gcp-sign`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ filename, action: 'write' })
    })
    const rv = await res.json()
    const res2 = await fetch(rv.url, { 
      method: 'PUT',
      body: files[0], // formData,
      headers: { 'Content-Type': 'application/octet-stream' }
    })
    alert('Google Upload: ' + (res2.ok) ? 'OK' : 'FAIL') 
  } catch (e) {
    alert('Google Upload: ' + e.toString())
  }
}

export async function uploadMemory(files) {
  // console.log(files)
  try {
    const formData = new FormData()
    formData.append('memory', files[0])
    const res = await fetch('/api/upload-memory', {
      method: 'POST', body: formData
    })
    const rv = await res.json()
    console.log(rv)
  } catch (e) {
    console.log(e)
  }
}

export async function uploadSingle(files) {
  // console.log(files)
  try {
    const formData = new FormData()
    formData.append('filedata', files[0])
    formData.append('textdata', JSON.stringify({ name: 'name', age: 25 }))
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    const rv = await res.json()
    console.log(rv)
  } catch (e) {
    console.log(e)
  }
}

export async function uploadMultiple(files) {
  console.log(files)
  // send in one request
  // not multiple request - files.forEach..., Promise.all
  try {
    const formData = new FormData()
    for (const file of files) {
      formData.append('photos', file, file.name);
    }
    const res = await fetch('/api/uploads', {
      method: 'POST', body: formData
    })
    const rv = await res.json()
    console.log(rv)
  } catch (e) {
    console.log(e)
  }
}
