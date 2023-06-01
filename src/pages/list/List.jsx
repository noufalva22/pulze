import './list.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import OrderDatatable from '../../components/datatable/OrderDatatable'
import UserDatatable from '../../components/datatable/UserDatatable'

const List = (page) => {

  console.log(page);
  return (
    <div className='list'>
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        {page.page === 'users'?  <UserDatatable/>:''}
        {page.page === 'orders'?  <OrderDatatable/>:''}
       

      </div>
    </div>
  )
}

export default List