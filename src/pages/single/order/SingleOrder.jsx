import './singleOrder.scss'
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
// import Chart from "../../components/chart/Chart";
// import List from "../../components/table/Table";
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminRequest, publicRequest } from '../../../requestMethods';
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
import SyncIcon from '@mui/icons-material/Sync';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { handleNotification } from '../../../utils/NotificationsUtils';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import PickupPanel from './PickupPanel';
import { saveAs } from 'file-saver';

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

    const [showPanel, setShowPanel] = useState(false);
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
        const productsDescription = orderData.products.map(product => `${product.productName} : ${product.qty}`).join('\n');
        const productsPrice = orderData.products.map(product => `${product.unitPrice} /-`);
        try {
            setLoading(true)

            console.log(productsPrice);
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
                        order: orderData.orderID,
                        // order: "NAK-21",
                        payment_mode: orderData.payment.method === 'COD' ? 'COD' : 'Pre-paid',


                        return_pin: "680303",
                        return_city: "Thrissur",
                        return_phone: "8943697432",
                        return_add: "Room No-1",
                        return_state: "Kerala",
                        return_country: "India",

                        product_details: productsDescription,
                        products_desc: productsDescription,
                        hsn_code: "",
                        cod_amount: orderData.totalOrderValue,
                        order_date: orderData.createdAt,
                        total_amount: orderData.totalOrderValue,
                        seller_add: "ROOM NO 1",
                        seller_name: "TIKK TAP COMMUNICATIONS",
                        seller_inv: "",
                        quantity: orderData.products.length,
                        waybill: "",
                        shipment_width: "150",
                        shipment_length: "100",
                        shipment_height: "5",
                        weight: orderData.products.length * 100,
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
            if (response.data.RES.success == true) {

                //update order status to manifest and waybill no
                setOrderData(prevOrderData => ({
                    ...prevOrderData,
                    status: 'manifested',
                    waybill: response.data.RES.packages[0].waybill,
                }));
                try {
                    console.log("1");
                    console.log(response.data.RES.packages[0].waybill);
                    const updatedOrderData = { ...orderData, status: "manifested", waybill: response.data.RES.packages[0].waybill };
                    const orderUpdateResponse = await adminRequest.put(`/order/${orderData._id}`, updatedOrderData);
                    console.log("2", orderUpdateResponse.data);
                    handleNotification('Success', 'Order status updated successfully.');
                    setLoading(false)
                } catch (err) {
                    console.log(err);
                    alert('Error in updating the order status.');
                    setLoading(false)
                }


            } else {
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
    const checkStatus = async () => {

        setLoading(true)
        try {
            const response = await adminRequest.get(`/shipment/track/${orderData.waybill}`)
            console.log(response.data);
            console.log(response.data.ShipmentData[0].Shipment.Status.Status);
            let STATUS = response.data.ShipmentData[0].Shipment.Status.Status;
            handleNotification('Success', `Status: ${STATUS} `);

            if (STATUS === 'Delivered' || STATUS === 'LOST' || STATUS === 'RTO') {
                setOrderData(prevOrderData => ({
                    ...prevOrderData,
                    status: STATUS,

                }));
                const updatedOrderData = { ...orderData, status: STATUS };
                try {
                    const response = await adminRequest.put(`/order/${orderData._id}`, updatedOrderData);

                } catch (error) {
                    handleNotification('Error', 'Failed to update order status.');
                }

            }
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }
    const printLabel = async () => {
        setLoading(true);
        console.log('Print Label');
        // const trackingNumbers = ['21917410000965', '21917410000976'];
        const trackingNumbers = orderData.waybill;
        console.log(trackingNumbers);
        const pdf = true;

        try {
            const response = await adminRequest.get('/shipment/printLabel', {
                params: {
                    //   wbns: trackingNumbers.join(','),
                    wbns: trackingNumbers,
                    pdf: pdf,
                },

            });
            if (!response.data || response.data.length === 0) {
                console.error('Invalid link received:', response.data);
                setLoading(false);
                return;
            }

            // Assuming response.data contains the S3 link
            const s3Link = response.data.pdfUrl;
            console.log(response.data);
            // Open the S3 link in a new window
            window.open(s3Link, '_blank');

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const calculateShippingCost = async () => {
        setLoading(true);
        console.log("shipping cost");

        const { emailId, username, products, totalOrderValue } = orderData;
        const cgm = orderData.products.length * 100; // Replace with the appropriate chargeable weight calculation based on your data
        const o_pin = 680303; // WH Replace with the origin pin code
        const d_pin = userData.pinCode; // Replace with the destination pin code
        const ss = "Delivered";
        // const pt ="Pre-paid";
        const pt = orderData.payment.method === 'COD' ? 'COD' : 'Pre-paid';
        // const cod = 456;
        const cod = orderData.payment.method === 'COD' ? orderData.totalOrderValue : 0;
        try {

            const res = await publicRequest.get(`/shipment/check-charge`, {

                params: {

                    md: "S",
                    cgm,
                    o_pin,
                    d_pin,
                    ss,
                    pt,
                    cod,
                },
            });

            const shippingCost = res.data[0].total_amount;
            console.log(res.data);
            console.log('Res', res.data);
            console.log('Shipping cost:', shippingCost);

            //Update shipping cost in order: in DB
            try {
                setOrderData(prevOrderData => ({
                    ...prevOrderData,
                    shippingCost: shippingCost,
                }));
                const updatedOrderData = { ...orderData, shippingCost: shippingCost };
                const response = await adminRequest.put(`/order/${orderData._id}`, updatedOrderData);
               console.log("Done");
             
                setLoading(false)
            } catch (error) {
                console.error('Request error:', error);
                handleNotification('Error', 'Failed to update shipping Charge.');
                // alert('Error creating order. Please try again.');
                setLoading(false)
            }
        } catch (error) {

            console.error('Error calculating shipping cost:', error.message);
            setLoading(false);
        }
    }

    const schedulePickup = async () => {
        setShowPanel(true);
        const pickupDetails = {
            pickup_time: "14:30:00",
            pickup_date: "2024-01-22",
            pickup_location: "Two",
            expected_package_count: 1
        };


        try {
            // Make an HTTP POST request to the Delhivery pickup request creation API
            const response = await axios.post('https://track.delhivery.com/fm/request/new/', pickupDetails, {
                headers: {
                    'Authorization': 'Token 206a3d4b79204b8a83c94be5972dbc16fc2f41a0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // You may need to include additional headers like authorization if required
                }
            });

            // Assuming the response includes the pickup_id
            const pickupId = response.data.pickup_id;

            // Do something with the pickupId, like updating state or displaying a message
            console.log('Pickup scheduled successfully. Pickup ID:', pickupId);

            // Optionally, you can update state to show a panel or display a success message
            setShowPanel(true);
        } catch (error) {
            // Handle any errors that occur during the API request
            console.error('Error scheduling pickup:', error);
            // Optionally, you can update state to show an error message
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
            case 'RTO':
                return 4;
            case 'LOST':
                return 4;
            case 'Delivered':
                return 5;
            default:
                return 0;
        }
    }; const handleClose = () => {
        setShowPanel(false);
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

            {showPanel && <PickupPanel onClose={handleClose} onSchedule={schedulePickup} />}
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
                                        <div className="detailItem status">
                                            <span className="itemKey">Status:</span>
                                            <span className="itemValue"
                                                style={{
                                                    color:
                                                        orderData.status === 'RTO' || orderData.status === 'LOST' ? 'red' :
                                                            orderData.status === 'Delivered' ? 'green' :
                                                                'darkcyan'
                                                }}
                                            >
                                                {orderData.status}</span>
                                            <span onClick={() => checkStatus()}> <SyncIcon /></span>
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
                                        <div className="detailItem">
                                            <span className="itemKey">Way Bill No :</span>
                                            <span className="itemValue">{orderData.waybill? orderData.waybill : '-'}</span>

                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Shipping Cost:</span>
                                            <span className="itemValue"> {orderData.shippingCost ? `₹ ${orderData.shippingCost} /-` : '-'}</span>

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
                                        <>
                                            <button onClick={() => shipNow()}>Ship Now</button>
                                            <button onClick={() => calculateShippingCost()}>Calculate Shipping Cost</button>
                                        </>
                                    )}
                                    {orderData.status === 'manifested' && (
                                        <>
                                            <button onClick={() => printLabel()}>Print Label</button>
                                            {/* <button onClick={() => schedulePickup()}>Schedule Pickup</button> */}
                                            <button onClick={() => schedulePickup()}>Schedule Pickup</button>
                                        </>
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