import React from 'react'
import './datatable.scss'
import { DataGrid } from "@mui/x-data-grid";
import { orderColumns, userRows } from './userDatatablesource';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from '../../requestMethods';
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";

const OrderDatatable = () => {
    const [data, setData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const handleDelete = (id) => {

        setData(data.filter((item) => item._id !== id));

        const deleteUser = async () => {

            try {
                const res = await publicRequest.delete(`/order/${id}`)
                console.log(res.data);
                setShowConfirmation(false);
                setDeleteItemId(null);
                console.log(`Deleting item with ID: ${deleteItemId}`);
                // setData(res.data)

            } catch (error) {
                console.log(error);
                setShowConfirmation(false);
                setDeleteItemId(null);
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


    const cancelDelete = () => {
        // Close the confirmation pop-up without deleting
        setShowConfirmation(false);
        setDeleteItemId(null);
    };

    useEffect(() => {
        if (!data || data.length === 0) {
            const getOrder = async () => {
                try {
                    const res = await publicRequest.get('/order/');
                    console.log("Order Data", res.data);

                    const formattedData = res.data.map((item, index) => {
                        const formattedDate = new Date(item.createdAt).toLocaleDateString("en-GB");
                        return { ...item, createdAt: formattedDate, key: index };
                    });
                    // formattedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    // console.log("sorted data", formattedData);
                    setData(formattedData);
                } catch (error) {
                    console.log(error);
                }
            };
            getOrder();
        }
    }, [data]);

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/orders/${params.row.orderID}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={() => {

                                setShowConfirmation(true)
                                setDeleteItemId(params.row._id)
                            }
                            }
                        >
                            Delete
                        </div>
                        {/* <span className={`status ${row.status}`}>{params.row.status}</span> */}
                    </div >
                );
            },
        },
    ];
    const getRowId = (row) => row._id;
    const sortModel = [
        // Define the default sorting
        {
          field: 'orderID',
          sort: 'desc', // Change to 'asc' for ascending order
        },
      ];
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Orders
                <Link to="/users/new" className="link">
                    Add New
                </Link>
            </div>
            <div className="datePickerContainer">
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    renderInput={(params) => <TextField {...params} />}
                />

                {/* <button onClick={handleUpdateSearch}>update</button> */}
            </div>
            {data &&
                <DataGrid
                    className="datagrid"
                    rows={data}
                    columns={orderColumns.concat(actionColumn)}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    checkboxSelection
                    getRowId={getRowId}
                    // sortModel={sortModel} 

                />}
            {showConfirmation && (
                <div className="confirmationPopup">
                    <div className="confirmationMessage">Are you sure?</div>
                    <div className="confirmationButtons">
                        <button onClick={() => { handleDelete(deleteItemId) }}>Yes</button>
                        <button onClick={cancelDelete}>No</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default OrderDatatable