import './datatable.scss'
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from './userDatatablesource';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from '../../requestMethods';
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { Bars } from 'react-loader-spinner'
const UserDatatable = () => {
    const [data, setData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
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
                    console.log(error);
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
    return (
        <div className="datatable">
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