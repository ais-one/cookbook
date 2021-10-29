import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Wrapper from '../../components/Wrapper'
// import { Link } from 'react-router-dom'
import Paginator from '../../components/Paginator'
import { Order } from '../../models/order'
import { OrderItem } from '../../models/order-item'

const hide = {
  maxHeight: 0,
  transition: '1000ms ease-in'
}

const show = {
  maxHeight: '150px',
  transition: '1000ms ease-out'
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(0)

  const [selected, setSelected] = useState(0)

  useEffect(() => {
    const getOrders = async () => {
      const { data } = await axios.get(`/order?page=${page}`)
      setOrders(data.data)
      setLastPage(data.meta.last_page)
    }
    getOrders()
  }, [])

  const select = async (id: number) => {
    setSelected(selected === id ? 0 : id)
  }

  const exportCsv = async () => {
    const { data } = await axios.post('/order/export', {}, { responseType: 'blob'})
    // const blob = new Blob([data], { type: 'text/csv' }) // not needed - https://stackoverflow.com/a/61302835/2215486
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a')
    link.href = url
    link.download = 'orders.csv'
    link.click()
  }

  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <a href="#" className="btn btn-sm btn-outline-secondary" onClick={exportCsv}>Export</a>
      </div>

      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Total</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: Order) => {
              return (
                <>
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.name}</td>
                    <td>{o.email}</td>
                    <td>{o.total}</td>
                    <td>
                      <div className="btn-group mr-2">
                        {/* <Link to={`/products/${p.id}/edit`}href="#" className="btn btn-sm btn-outline-secondary">Edit</Link>
                        <a href="#" className="btn btn-sm btn-outline-secondary" onClick={() => del(p.id)}>Delete</a> */}
                        <a href="#" className="btn btn-sm btn-outline-secondary" onClick={() => select(o.id)}>View</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5}>
                      <div className="overflow-hidden" style={selected === o.id ? show : hide}>
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Product Title</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.order_item.map((oi: OrderItem) => {
                              return (
                                <tr>
                                  <td>{oi.id}</td>
                                  <td>{oi.product_title}</td>
                                  <td>{oi.quantity}</td>
                                  <td>{oi.price}</td>
                                </tr>  
                              )
                            })}
                          </tbody>

                        </table>
                      </div>

                    </td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      <Paginator page={page} lastPage={lastPage} pageChanged={setPage} />
    </Wrapper>
  )
}

export default Orders
