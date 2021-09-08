import axios from 'axios'
import React from 'react'

const ImageUpload = (props: { uploaded: (url: string) => void }) => {
  const upload = async (files: FileList | null) => {
    if (files === null) return

    const formData = new FormData()
    formData.append('product-image', files[0])

    const { data } = await axios.post('/upload', formData)
    props.uploaded(data.url)
  }

  return (
    <div>
      <label className="btn btn-primary">
        Upload <input type="file" hidden onChange={(e) => upload(e.target.files)} />
      </label>
    </div>
  )
}

export default ImageUpload
