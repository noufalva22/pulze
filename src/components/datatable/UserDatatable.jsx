import './datatable.scss'
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from './userDatatablesource';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from '../../requestMethods';
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";

const UserDatatable = () => {
    const [data, setData] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const handleDelete = (id) => {
        setData(data.filter((item) => item._id !== id));
        const deleteUser = async () => {

            try {
                const res = await publicRequest.delete(`/userData/${id}`)
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
                    const res = await publicRequest.get('/userData/')
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
    return (
        <div className="datatable">
            <div className="datatableTitle">
                User
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
                    columns={userColumns.concat(actionColumn)}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    checkboxSelection
                    getRowId={getRowId}

                />}
        </div>
    )
}

export default UserDatatable