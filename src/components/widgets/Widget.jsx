import './widget.scss'
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ForkRightOutlinedIcon from '@mui/icons-material/ForkRightOutlined';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ContactlessOutlinedIcon from '@mui/icons-material/ContactlessOutlined';
import { publicRequest } from '../../requestMethods';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
const Widget = ({ type }) => {

    let data;
    //temporary
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['access_token']);
    // console.log("123", cookies.access_token);
    const adminEmail = useSelector((state) => state.userAdmin.email)
    const isAdmin = useSelector((state) => state.userAdmin.isAdmin)
    const _id = useSelector((state) => state.userAdmin._id)

    const amount = 100;
    const diff = 20;
    const [ALL_ORDER, setALL_ORDER] = useState()
    const [ALL_USER, setALL_USER] = useState()
    const [ALL_TAPS, setALL_TAPS] = useState()
    const [websiteTraffic, setWebsiteTraffic] = useState()

    const [orderToday, setOrderToday] = useState([]);
    const [orderLast30Days, setOrderLast30Days] = useState([]);
    const [userToday, setUserToday] = useState([]);
    const [userLast30Days, setUserLast30Days] = useState([]);
    const [tapToday, setTapToday] = useState([]);
    const [tapLast30Days, setTapLast30Days] = useState([]);

    const [websiteTrafficToday, setWebsiteTrafficToday] = useState([]);
    const [websiteTraffic30Days, setWebsiteTraffic30Days] = useState([]);
    
    useEffect(() => {
        const token = cookies.access_token;
        console.log("123", cookies.access_token);
    }, [cookies.access_token]);

    const getOrderData = async () => {
        try {
            const res = await publicRequest.get(`/order/`, {
                withCredentials: true
            })
            console.log("orders is", res.data);
            setALL_ORDER(res.data)
            // Filter orders for today
            const today = new Date().toISOString().split('T')[0]; // Get today's date in the format 'YYYY-MM-DD'
            const ordersToday = res.data.filter(order => order.createdAt.startsWith(today));
            setOrderToday(ordersToday);
            // Filter orders for the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            // Get the date 30 days ago from today
            const ordersLast30Days = res.data.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= thirtyDaysAgo;
            });

            setOrderLast30Days(ordersLast30Days);

        } catch (error) {
            console.log(error);
        }
    }
    const getUserData = async () => {
        try {
            const res = await publicRequest.get(`/userData`, {
                withCredentials: true
            })
            setALL_USER(res.data)
            // Filter orders for today
            const today = new Date().toISOString().split('T')[0]; // Get today's date in the format 'YYYY-MM-DD'
            const userToday = res.data.filter(user => user.createdAt.startsWith(today));
            setUserToday(userToday);
            // Filter users for the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            // Get the date 30 days ago from today
            const usersLast30Days = res.data.filter(user => {
                const userDate = new Date(user.createdAt);
                return userDate >= thirtyDaysAgo;
            });

            setUserLast30Days(usersLast30Days);

        } catch (error) {
            console.log(error);
        }
    }
    const getTapData = async () => {
        try {
            const res = await publicRequest.get(`/log`, {
                withCredentials: true
            })
            setALL_TAPS(res.data)
            // Filter orders for today
            const today = new Date().toISOString().split('T')[0];
            // Get today's date in the format 'YYYY-MM-DD'
            const tapToday = res.data.filter(user => user.createdAt.startsWith(today));
            setTapToday(tapToday);
            // Filter users for the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            // Get the date 30 days ago from today
            const tapLast30Days = res.data.filter(tap => {
                const tapDate = new Date(tap.createdAt);
                return tapDate >= thirtyDaysAgo;
            });

            setTapLast30Days(tapLast30Days);

        } catch (error) {
            console.log(error);
        }
    }
    const getWebsiteVisitLog = async () => {
        try {
            const res = await publicRequest.get(`/websiteLog`, {
                withCredentials: true
            })
            setWebsiteTraffic(res.data)
            const today = new Date().toISOString().split('T')[0];
            const websiteTrafficToday = res.data.filter(user => user.createdAt.startsWith(today));
            setWebsiteTrafficToday(websiteTrafficToday);

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const websiteTrafficLast30Days = res.data.filter(tap => {
                const tapDate = new Date(tap.createdAt);
                return tapDate >= thirtyDaysAgo;
            });

            setWebsiteTraffic30Days(websiteTrafficLast30Days);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getOrderData();
        getUserData();
        getTapData();
        getWebsiteVisitLog()
    }, []);
    useEffect(() => {
        if (ALL_ORDER) {
            console.log(ALL_ORDER);
        }
    }, [ALL_ORDER]);
    // getOrderData().then(()=>{
    //     console.log(ALL_ORDER);
    // })

    switch (type) {



        case "users":
            data = {
                title: "USERS",
                FTD: userToday?.length,
                MTD: userLast30Days?.length,
                link: " See all users",
                icons: <PersonOutlinedIcon className='icon' style={{
                    color: "crimson",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                }} />


            };
            break;
        case "orders":
            data = {
                title: "ORDERS",
                FTD: orderToday?.length,
                MTD: orderLast30Days?.length,
                link: " View all orders",
                icons: <ShoppingCartOutlinedIcon className='icon' style={{
                    backgroundColor: "rgba(218, 165, 32, 0.2)",
                    color: "goldenrod",
                }} />


            };
            break;
        case "taps":
            data = {
                title: "TAPS",
                FTD: tapToday?.length,
                MTD: tapLast30Days?.length,
                link: "View all taps",
                icons: <ContactlessOutlinedIcon className='icon' style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }} />


            };
            break;
        case "websiteTraffic":
            data = {
                title: "WEBSITE TRAFFIC",
                FTD: websiteTrafficToday?.length,
                MTD: websiteTraffic30Days?.length,
                link: " See details",
                icons: <ForkRightOutlinedIcon className='icon' style={{
                    backgroundColor: "rgba(128, 0, 128, 0.2)",
                    color: "purple",
                }} />


            };
            break;
        default:
            break;
    }
    return (

        <div className='widget' >
            <div className="left">
                <span className='title'>{data.title}</span>
                <span className='counter'>{data.FTD}</span>
                <span className='sub-title'>FTD</span>
                <span className='link' onClick={() => {
                    navigate({
                        pathname: `/${type}`,
                    });
                }}>{data.link}</span>
            </div>
            <div className="right">
                <span className='sub-title'>MTD</span>
                <div className="percentage positive">
                    <KeyboardArrowUpIcon />
                    {diff}%
                </div>
                <span className='counter'>{data.MTD}</span>
                {data.icons}
            </div>

        </div>
    )
}

export default Widget