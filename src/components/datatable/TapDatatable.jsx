import React from 'react'
import './datatable.scss'
import { DataGrid } from "@mui/x-data-grid";
import { tapsColumns, userRows } from './userDatatablesource';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from '../../requestMethods';
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { Bars } from 'react-loader-spinner'

const TapDatatable = () => {
    const [data, setData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    useEffect(() => {
        if (!data || data.length === 0) {
            const getOrder = async () => {
                try {
                    const res = await publicRequest.get('/log/', {
                        withCredentials: true
                    });
                    console.log("tap", res);


                    const formattedData = res.data.map((item, index) => {
                        const formattedDate = new Date(item.createdAt).toLocaleString("en-GB", {
                            dateStyle: "short",
                            timeStyle: "short"
                        });
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

        },
    ];
    const getRowId = (row) => row._id;
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Taps

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
            {data ?
                <DataGrid
                    className="datagrid"
                    rows={data}
                    columns={tapsColumns}
                    pageSize={9}
                    rowsPerPageOptions={[9]}

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
            {showConfirmation && (
                <div className="confirmationPopup">
                    <div className="confirmationMessage">Are you sure?</div>

                </div>
            )}
        </div>
    )
}

export default TapDatatable