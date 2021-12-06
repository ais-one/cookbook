import React, { SyntheticEvent, useState } from 'react'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { Navigate } from 'react-router-dom'
import ImageUpload from '../../components/ImageUpload'

const ProductsCreate = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('') // selected permissions
  const [price, setPrice] = useState('')
  const [redirect, setRedirect] = useState(false)

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    await axios.post('/product', {
      title, description, image, price
    })
    setRedirect(true)
  }

  if (redirect) return <Navigate to="/products" />
  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Title</label>
          <input className="form-control" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" onChange={(e) => setDescription(e.target.value)} ></textarea>
        </div>
        <div className="mb-3">
          <label>Image</label>
          <div className="input-group">
            <input className="form-control" value={image} onChange={(e) => setImage(e.target.value)} />
            <ImageUpload uploaded={setImage} />
          </div>
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input className="form-control" onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button className="btn btn-outline-secondary">Save</button>
      </form>

    </Wrapper>
  )
}

export default ProductsCreate
