import './datatable.scss'
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from './userDatatablesource';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from '../../requestMethods';
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { Bars } from 'react-loader-spinner'
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UserDatatable = () => {
    const [data, setData] = useState();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState()
    const [showLogin, setShowLogin] = useState(false);
    const email = useSelector((state) => state.userAdmin.email);
    const handleDelete = (id) => {
        setData(data.filter((item) => item._id !== id));
        const deleteUser = async () => {

            try {
                const res = await publicRequest.delete(`/userData/${id}`, {
                    withCredentials: true
                })
                console.log(res.data);

                // setData(res.data)

            } catch (error) {
                console.log(error);
            }
        }
        deleteUser()

    };
    const handleUpdateSearch = async () => {
        try {
            const res = await publicRequest.get(`/userData/search`, { startDate, endDate })
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleLogin = async () => {
        try {

            const res = await publicRequest.post('/auth/login', { email: email, password: password }, {
                withCredentials: true
            })
            setShowLogin(false);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message)
        }

    }

    useEffect(() => {

        if (data === null || data === undefined || data === '') {


            const getUser = async () => {

                try {
                    const res = await publicRequest.get('/userData/', {
                        withCredentials: true
                    })
                    console.log(res.data);
                    const formattedData = res.data.map((item, index) => {
                        const formattedDate = new Date(item.createdAt).toLocaleDateString("en-GB");
                        return { ...item, createdAt: formattedDate, key: index };
                    });
                    setData(formattedData);

                } catch (error) {
                    console.log(error.response.data);
                    if (error.response.data == `You're not authenticated!`) {
                        console.log("No login", email);
                        if (email === null || email === undefined) {
                            navigate({
                                pathname: '/login',
                            });
                        } else {

                            setShowLogin(true);
                        }
                    }

                }
            }
            getUser()
        }
    })
    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/users/${params.row.emailId}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={() => handleDelete(params.row._id)}
                        >
                            Delete
                        </div>
                    </div>
                );
            },
        },
    ];
    const getRowId = (row) => row._id;
    const sortModel = [
        // Define the default sorting
        {
            field: 'createdAt',
            sort: 'desc', // Change to 'asc' for ascending order
        },
    ];


    useEffect(() => {
        if (errorMessage != "") {

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                icon: true,
                theme: "colored",
                // transition:"zoom",

            });
        }


    }, [errorMessage])
    return (
        <div className="datatable">
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
            {/* if no acces token. show password input box */}
            {showLogin && (
                <div className="login-panel">
                    <div className="login-container">
                        <TextField
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button variant="contained" onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                </div>
            )}
            <div className="datatableTitle">
                User
                <Link to="/users/new" className="link">
                    Add New
                </Link>
            </div>
            <div className="datePickerContainer">


                {/* <button onClick={handleUpdateSearch}>update</button> */}
            </div>
            <div className="grid">

                {data ?
                    <DataGrid
                        className="datagrid"
                        rows={data}
                        columns={userColumns.concat(actionColumn)}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                        checkboxSelection
                        getRowId={getRowId}
                    // sortModel={sortModel} 

                    /> : <div className="loader">

                        <div class="loading">
                            <svg width="64px" height="48px">
                                <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
                                <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
                            </svg>
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default UserDatatable