import './singleOrder.scss'
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
// import Chart from "../../components/chart/Chart";
// import List from "../../components/table/Table";
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminRequest } from '../../../requestMethods';
import { Bars, ColorRing } from 'react-loader-spinner'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import '../../../../public/Theme/Theme-1/'
import VerifiedIcon from '@mui/icons-material/Verified';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { handleNotification } from '../../../utils/NotificationsUtils';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const SingleOrder = () => {
    const location = useLocation()
    const orderID = location.pathname.split("/")[2]
    const [loading, setLoading] = useState(false);
    // console.log(orderID);

    const [userData, setUserData] = useState()
    const [USER_ALLDATA, SET_USERALLDATA] = useState()
    const [orderData, setOrderData] = useState()
    const [email, setEmail] = useState()
    const [username, setUsername] = useState()
    const [total, setTotal] = useState(0);
    let loadFlag = 0
    useEffect(() => {
        if (loadFlag === 0) {

            if (orderID && userData === undefined) {
                loadFlag += 1
                //FETCH ORDER  DATA
                const getOrderData = async () => {
                    try {
                        const res = await adminRequest.get(`/order/${orderID}`, {
                            withCredentials: true
                        })
                        setOrderData(res.data)
                        console.log("Order Data", res.data);
                        setEmail(res.data.emailId)
                        setUsername(res.data.username)
                    } catch (error) {
                        console.log(error);
                    }
                }
                getOrderData()




            }
        }
    }, [orderID])

    useEffect(() => {
        //get all username or all accounts of the user. 
        const GET_USER_ALLDATA = async () => {
            try {

                const res = await adminRequest.get(`/userData/find/${email}`)
                SET_USERALLDATA(res.data)

            } catch (error) {
                console.log(error);
            }
        }
        GET_USER_ALLDATA()
    }, [email])
    useEffect(() => {

        if (username !== undefined) {

            //get once userdata of a user. username will be associated with ordered id
            const getUserData = async () => {
                try {
                    const res = await adminRequest.get(`/userData/get/${username}`)
                    setUserData(res.data)
                    console.log("User Data", res.data);
                } catch (error) {
                    console.log(error);
                }
            }
            getUserData()
        }

    }, [username])
    useEffect(() => {
        let sum = 0;
        if (orderData !== undefined && orderData != null) {

            orderData.products.forEach((row) => {
                sum += row.unitPrice;
            });
            setTotal(sum);
        }
    }, [orderData]);



    const shipNow = async () => {
        console.log("Ship now");
        try {
            setLoading(true)


            const shipmentPayload = {
                shipments: [
                    {
                        name: userData.name,
                        add: userData.fullAddress,
                        pin: userData.pinCode,
                        city: userData.city,
                        state: userData.state,
                        country: userData.country,
                        phone: userData.mobile,
                        // order: orderData.orderID,
                        order: "NAK-20",
                        payment_mode: orderData.payment.method === 'COD' ? 'COD' : 'Pre-paid',


                        return_pin: "",
                        return_city: "",
                        return_phone: "",
                        return_add: "",
                        return_state: "",
                        return_country: "",
                        products_desc: "",
                        hsn_code: "",
                        cod_amount: orderData.totalOrderValue,
                        order_date: orderData.createdAt,
                        total_amount: orderData.totalOrderValue,
                        seller_add: "cdcdcdsc",
                        seller_name: "dcsdcdc",
                        seller_inv: "cdc",
                        quantity: orderData.products.length,
                        waybill: "",
                        shipment_width: "100",
                        shipment_height: "100",
                        weight: orderData.products.length*100,
                        seller_gst_tin: "",
                        shipping_mode: "Surface",
                        address_type: ""
                    }
                ],
                pickup_location: {
                    name: "Two",
                    add: "Room No 1",
                    city: "Delhi",
                    pin_code: 680303,
                    country: "India",
                    phone: "9947672066"
                },
            };


           
            const response = await adminRequest.post('/shipment/create', shipmentPayload);
            // console.log(response.data.RES.success);
            console.log(response.data);
           if(response.data.RES.success ==true){
          
            //update order status to manifest and waybill no
            setOrderData(prevOrderData => ({
                ...prevOrderData,
                status: 'manifested',
                waybill: response.data.RES.packages[0].waybill,
            }));
            try {
                console.log("1");
                console.log(response.data.RES.packages[0].waybill);
                const updatedOrderData = { ...orderData, status: "manifested",  waybill: response.data.RES.packages[0].waybill};
                const orderUpdateResponse = await adminRequest.put(`/order/${orderData._id}`, updatedOrderData);
                console.log("2",orderUpdateResponse.data);
                handleNotification('Success', 'Order status updated successfully.');
                setLoading(false)
            } catch (err) {
                console.log(err);
                alert('Error in updating the order status.');
                setLoading(false)
            }
        
            
        }else{
            handleNotification('Error', response.data.RES.packages[0].remarks[0]);
            setLoading(false)
           }
           

        } catch (error) {
            console.error('Request error:', error);
            alert('Error creating order. Please try again.');
            setLoading(false)
        }




    }
    const confirmOrder = async () => {
        console.log("confirm order");
        setLoading(true)
        try {
            setOrderData(prevOrderData => ({
                ...prevOrderData,
                status: 'confirmed',
            }));
            const updatedOrderData = { ...orderData, status: "confirmed" };
            const response = await adminRequest.put(`/order/${orderData._id}`, updatedOrderData);
            console.log(response);
            handleNotification('Success', 'Order status updated successfully.');
            setLoading(false)
        } catch (error) {
            console.error('Request error:', error);
            handleNotification('Error', 'Failed to update order status.');
            // alert('Error creating order. Please try again.');
            setLoading(false)
        }
    }
    const [isCopied, setIsCopied] = useState(false);
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            });
    }
    const handleCopyClick = (value) => {
        copyToClipboard(value);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 10000); // Reset the copied state after 10 seconds
    };

    //Material UI Order Steps

    const steps = [
        'Ordered',
        'Confirmed',
        'Manifested',
        'In Transist',
        'Delivered'
    ];

    const getOrderStatusStep = (status) => {
        switch (status) {
            case 'pending':
                return 1;
            case 'confirmed':
                return 2;
            case 'manifested':
                return 3;
            case 'in-transit':
                return 4;
            case 'delivered':
                return 5;
            default:
                return 0;
        }
    };

    return (
        <div className="singleOrder">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {loading && (
                <div className="loader-container">

                    <ColorRing

                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />
                </div>
            )}
            <Sidebar />
            <div className="singleOrderContainer">
                <Navbar />
                {userData ?
                    <>
                        <div className="top">
                            <div className="left" >
                                <Link to={`/users/${email}`}>
                                    <div className="editButton"><DoubleArrowIcon /></div>
                                </Link>
                                <h1 className="title">User Info</h1>
                                <div className="item">
                                    <img
                                        src={userData.image ? userData.image : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                        alt=""
                                        className="itemImg"
                                    />
                                    <div className="details">
                                        <h1 className="itemTitle" onClick={() => handleCopyClick(userData.name)}>{userData.name}</h1>
                                        <div className="detailItem">
                                            <span className="itemKey">Bio:</span>
                                            <span className="itemValue">{userData.bio}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Email:</span>
                                            <span className="itemValue" onClick={() => handleCopyClick(userData.emailId)}>{userData.emailId}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Username:</span>
                                            <span className="itemValue">{userData.username}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Phone:</span>
                                            <span className="itemValue">{userData.mobile}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Address:</span>
                                            <span className="itemValue" onClick={() => handleCopyClick(userData.fullAddress)}>
                                                {userData.fullAddress}{", "}
                                            </span>
                                            <span className="itemValue">
                                                {userData.city}{", "}
                                            </span>
                                            <span className="itemValue">
                                                {userData.state}{", "}
                                            </span>
                                            <span className="itemValue" onClick={() => handleCopyClick(userData.pinCode)}>
                                                {userData.pinCode}
                                            </span>

                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Country:</span>
                                            <span className="itemValue">{userData.country}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="accounts">
                                    {userData.accounts.map((account, index) => {
                                        return <div className="account" key={index} onClick={() => {
                                            if (account.account == 'WhatsApp') {
                                                window.open("https://wa.me/" + account.link)
                                            } else {

                                                if (account.account == 'Mail') {
                                                    window.location.href = "mailto:" + account.link;
                                                } else {

                                                    if (account.account == 'Call') {
                                                        window.location.href = "tel:" + account.link;
                                                    } else {
                                                        if (account.account == 'Telegram') {
                                                            window.open(" https://t.me/" + account.link)

                                                            // window.open("https://api.ultramsg.com/instance5664/messages/chat?token=bp5wa2ylcekl6ju3&to=+918943697432&body=WhatsApp+API+on+UltraMsg.com+works+good&priority=10")
                                                        } else {

                                                            window.open(account.link);
                                                        }



                                                    }
                                                }
                                            }
                                        }}>
                                            <div className="image">

                                                <img src={`../../../../Theme/Theme-1/${account.account}.svg`} alt="Account Icon" />
                                            </div>
                                            <span className={`label ${account.status}`} >{account.status}</span>
                                            {/* <VerifiedIcon/> */}
                                        </div>
                                    })}
                                </div>


                            </div>


                            <div className="right">
                                <div>

                                    <Box sx={{ width: '100%' }}>
                                        <Stepper activeStep={getOrderStatusStep(orderData.status)} alternativeLabel>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel>{label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </div>
                                <div className="details">
                                    <div className="section-1">

                                        <h1 className="title">Order Info</h1>
                                        <div className="detailItem">
                                            <span className="itemKey">Order ID:</span>
                                            <span className="itemValue">{orderData.orderID}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Status:</span>
                                            <span className="itemValue">{orderData.status}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Payment:</span>

                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Mode:</span>
                                            <span className="itemValue">{orderData.payment.method}</span>

                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">ID:</span>
                                            <span className="itemValue">{orderData.payment.method === "COD" ? 'COD' : orderData.payment.paymentID}</span>

                                        </div>
                                    </div>
                                    <div className="section-2">
                                        <div className="detailItem">
                                            <span className="itemKey">Amount:</span>
                                            <span className="itemValue">{orderData.amount}</span>

                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Delivery Charge:</span>
                                            <span className="itemValue">{orderData.deliveryCharge}</span>

                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Total:</span>
                                            <span className="itemValue">{orderData.totalOrderValue}</span>

                                        </div>

                                    </div>


                                </div>
                                <div className="products">
                                    <h1 className="title">Cart Products</h1>
                                    <TableContainer component={Paper} className="table">
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className="tableCell">Product ID</TableCell>
                                                    <TableCell className="tableCell">Product</TableCell>
                                                    <TableCell className="tableCell">Quantity</TableCell>
                                                    <TableCell className="tableCell">Price</TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderData.products.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className="tableCell">{row.productID}</TableCell>
                                                        <TableCell className="tableCell">
                                                            <div className="cellWrapper">
                                                                <img src={row.image} alt="" className="image" />
                                                                {row.productName}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="tableCell">{row.qty}</TableCell>
                                                        <TableCell className="tableCell">{row.unitPrice}</TableCell>

                                                    </TableRow>
                                                ))}
                                                {/* <TableRow>
                                                    <TableCell colSpan={3} className="tableCell totalCell">Item Total:</TableCell>
                                                    <TableCell className="tableCell totalCell">{total}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} className="tableCell totalCell">Delievry:</TableCell>
                                                    <TableCell className="tableCell totalCell">{orderData.deliveryCharge}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={3} className="tableCell totalCell">Total:</TableCell>
                                                    <TableCell className="tableCell totalCell">{orderData.totalOrderValue}</TableCell>
                                                </TableRow> */}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                                <div className="actions">
                                    {orderData.status === 'pending' && (
                                        <button onClick={() => confirmOrder()}>Confirm Order</button>
                                    )}
                                    {orderData.status === 'confirmed' && (
                                        <button onClick={() => shipNow()}>Ship Now</button>
                                    )}
                                    {orderData.status === 'manifested' && (
                                        <button onClick={() => shipNow()}>Check Status</button>
                                    )}


                                </div>



                            </div>
                        </div>
                    </>
                    : orderData == null ? 'No data' : <Bars
                        heigth="100"
                        width="100"
                        color='#0b2b66'
                        ariaLabel='loading' className='loaderbox' />}

            </div>
        </div>
    )
}

export default SingleOrder