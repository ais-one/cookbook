import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import axios from 'axios'

import Wrapper from '../../components/Wrapper'
import { Navigate } from 'react-router-dom'
// import { Product } from '../../models/product'
import ImageUpload from '../../components/ImageUpload'

const ProductsEdit = (props: any) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('') // selected permissions
  const [price, setPrice] = useState('')
  const [redirect, setRedirect] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const getProducts = async () => {
      const {data} = await axios.get(`/product/${props.match.params.id}`)
      setTitle(data.title)
      setDescription(data.description)
      setImage(data.image)
      setPrice(data.price)

    }
    getProducts()
  }, [])

  const updateImage = (url: string) => {
    if (ref.current) {
      ref.current.value = url
    }
    setImage(url)
  }

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()
    await axios.put(`/product/${props.match.params.id}`, {
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
          <input className="form-control" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" defaultValue={description} onChange={(e) => setDescription(e.target.value)} ></textarea>
        </div>
        <div className="mb-3">
          <label>Image</label>
          <div className="input-group">
            <input className="form-control" ref={ref} defaultValue={image} onChange={(e) => setImage(e.target.value)} />
            <ImageUpload uploaded={updateImage} />
          </div>
        </div>
        <div className="mb-3">
          <label>Price</label>
          <input className="form-control" defaultValue={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  )
}

export default ProductsEdit
