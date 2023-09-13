import React from 'react'
import './home.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import Widget from '../../components/widgets/Widget'
import Featured from '../../components/featured/Featured'
import Chart from '../../components/chart/Chart'
import Table from '../../components/table/Table'

const Home = () => {
    return (
        <div className='home'>
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget type="orders" />
                    <Widget type="users" />
                    <Widget type="taps" />
                    <Widget type="websiteTraffic" />
                </div>
                <div className="charts">
                    <Featured />
                    <Table />
                    <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
                </div>
                <div className="listContainer">
                    <div className="listTitle">Latest transactions</div>
                    <Table />
                </div>
            </div>
        </div>
    )
}

export default Home