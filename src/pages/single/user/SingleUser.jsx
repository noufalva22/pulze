import "./SingleUser.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Chart from "../../../components/chart/Chart";
import List from "../../../components/table/Table";
import { useLocation } from "react-router-dom";
import { publicRequest } from "../../../requestMethods";
import { adminRequest } from "../../../requestMethods";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Bars } from 'react-loader-spinner'
const SingleUser = () => {
  const location = useLocation()
  const EMAIL = location.pathname.split("/")[2]
  const [userData, setUserData] = useState()
  const [USER_ALLDATA, SET_USERALLDATA] = useState()
  const [orderData, setOrderData] = useState()
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [total, setTotal] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0)
  let loadFlag = 0
  useEffect(() => {
    if (loadFlag === 0) {

      if (EMAIL && userData === undefined) {
        loadFlag += 1
        //FETCH ALL USER  DATA
        const getUserAllData = async () => {
          try {
            const res = await adminRequest.get(`/userData/find/${EMAIL}`)
            SET_USERALLDATA(res.data)
            console.log("User all Data", res.data);

          } catch (error) {
            console.log(error);
          }
        }
        getUserAllData()
        //FETCH ALL ORDER DATA BY EMAIL
        const getOrders = async () => {
          try {
            const res = await adminRequest.get(`/order/get/${EMAIL}`, {
              withCredentials: true
          })
            setOrderData(res.data)
            console.log("User order data", res.data);

          } catch (error) {
            console.log(error);
          }
        }
        getOrders()




      }
    }
  }, [EMAIL])
  return (
    <div className="single">
      <Sidebar />
      <div className="singleOrderContainer">
        <Navbar />
        {USER_ALLDATA !== undefined && USER_ALLDATA !== null  && USER_ALLDATA.length >0 ? (
          <>
            <div className="top">
              <div className="left">
                <div className="editButton">Edit</div>
                <h1 className="title">User Info</h1>
                <div className="item">
                  <img
                    src={USER_ALLDATA[selectedIndex].image ? USER_ALLDATA[selectedIndex].image : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                    alt=""
                    className="itemImg"
                  />
                  <div className="details">
                    <h1 className="itemTitle">{USER_ALLDATA[selectedIndex].name}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Bio:</span>
                      <span className="itemValue">{USER_ALLDATA[selectedIndex].bio}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <span className="itemValue">{USER_ALLDATA[selectedIndex].emailId}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Username:</span>
                      <span className="itemValue">{USER_ALLDATA[selectedIndex].username}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Phone:</span>
                      <span className="itemValue">{USER_ALLDATA[selectedIndex].mobile}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Address:</span>
                      <span className="itemValue">
                        {USER_ALLDATA[selectedIndex].fullAddress}{", "}
                      </span>
                      <span className="itemValue">
                        {USER_ALLDATA[selectedIndex].city}{", "}
                      </span>
                      <span className="itemValue">
                        {USER_ALLDATA[selectedIndex].state}{", "}
                      </span>
                      <span className="itemValue">
                        {USER_ALLDATA[selectedIndex].pinCode}
                      </span>

                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Country:</span>
                      <span className="itemValue">{USER_ALLDATA[selectedIndex].country}</span>
                    </div>
                  </div>
                </div>
                <div className="accounts">
                  {USER_ALLDATA[selectedIndex].accounts.map((account, index) => {
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

                <div className="products">
                  <h1 className="title">All usernames</h1>
                  <TableContainer component={Paper} className="table">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className="tableCell">Username</TableCell>
                          <TableCell className="tableCell">Name</TableCell>
                          <TableCell className="tableCell">Theme</TableCell>


                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {USER_ALLDATA.map((row, index) => (
                          <TableRow key={index} onClick={() => setSelectedIndex(index)} >
                            <TableCell className="tableCell">{row.username}</TableCell>
                            {/* <TableCell className="tableCell">{row.name}</TableCell> */}
                            <TableCell className="tableCell">
                              <div className="cellWrapper">
                                <img src={row.image ? row.image : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" className="image" />
                                {row.name}
                              </div>
                            </TableCell>

                            <TableCell className="tableCell">{row.theme}</TableCell>

                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>




              </div>
            </div>
          </>
        ) : 'No Data'}

      </div>
    </div>
  );
};

export default SingleUser;