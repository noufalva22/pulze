import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import './products.scss'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { publicRequest } from '../../requestMethods';
import { Bars } from 'react-loader-spinner'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
const Products = () => {

    const [selectedIndex, setSelectedIndex] = useState(2)
    const [products, setProducts] = useState()
    const [selectedProduct, setSelectedProduct] = useState()
    const [selectedImg, setSelectedImg] = useState(0);
    const [imageLoading, setImageLoading] = useState(false);

    const [productID, setProductID] = useState()
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [category, setCategory] = useState()
    const [MRP, setMRP] = useState()
    const [price, setPrice] = useState()
    var loadFlag = 0
    useEffect(() => {
        if (loadFlag === 0) {

            const getProducts = async () => {

                try {
                    const res = await publicRequest.get(`/products`)
                    setProducts(res.data)
                    console.log(res.data);
                    loadFlag += 1

                } catch (error) {

                }
            }
            getProducts()
        }
    }, [])
    const handleUpdate = async () => {
        try {
            const res = await publicRequest.put(`/product/${userId}/accounts/${ACCOUNT_DATA._id}`, newLink);
           
        } catch (error) {
                console.log(error);
        }
    }
    return (
        <div className='products'>
            <Sidebar />
            <div className="singleProductContainer">
                <Navbar />

                <div className="top">
                    <div className="left">
                        <div className="products">

                            <TableContainer component={Paper} className="table">
                                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="tableCell">Product ID</TableCell>
                                            <TableCell className="tableCell">Price</TableCell>
                                            <TableCell className="tableCell">MRP</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products ? products.map((product, index) => (
                                            <TableRow key={index} onClick={() => {
                                                setSelectedProduct(product)
                                                setSelectedIndex(index)
                                            }} >
                                                <TableCell className="tableCell">
                                                    <div className="cellWrapper">
                                                        <img src={product.image ? product.image[0].src : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" className="image" />
                                                        {product.title}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="tableCell">{product.MRP}</TableCell>
                                                <TableCell className="tableCell">{product.price}</TableCell>
                                            </TableRow>
                                        )) : ''}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    {products && <div className="right">
                        <div className="images">

                            <div className="grid">
                                {products && products[selectedIndex].image.map((image, index) => {
                                    return <>
                                        <img src={image.src} alt="productImage"
                                            className={selectedImg === index ? "selected" : ""}
                                            onClick={(e) => {
                                                if (selectedImg !== index) {

                                                    setSelectedImg(index)
                                                    setImageLoading(true)
                                                }
                                            }
                                            }
                                        />
                                    </>
                                })}

                            </div>
                            <div className="mainImage">
                                {imageLoading &&

                                    <Bars

                                        heigth="30"
                                        width="30"
                                        color='#0b2b66'
                                        ariaLabel='loading' className='loaderbox' />
                                }
                                <img
                                    style={{ display: imageLoading ? 'none' : 'block' }}
                                    src={products[selectedIndex].image[selectedImg].src} alt="mainImage"
                                    onLoad={() => setImageLoading(false)} />
                            </div>
                            <div className="action">
                                <DriveFolderUploadIcon className='icon' />
                                <DeleteIcon className='icon' />
                            </div>
                        </div>
                        <hr />


                        <div className="details">
                            <form>
                                <div className="formInput">

                                    <label>Product ID</label>
                                    <input type="text" value={products[selectedIndex]._id}
                                        onChange={(e) => setProductID(e.target.value)} />
                                </div>
                                <div className="formInput">

                                    <label>Title</label>
                                    <input type="text" value={products[selectedIndex].title}
                                        onChange={(e) => setProductID(e.target.value)} />
                                </div>
                                <div className="formInput">

                                    <label>Description</label>
                                    <textarea
                                        value={products[selectedIndex].desc}
                                        onChange={(e) => setProductID(e.target.value)}
                                    />
                                </div>
                                <div className="formInput">

                                    <label>Category</label>
                                    <input type="text" value={products[selectedIndex].category}
                                        onChange={(e) => setProductID(e.target.value)} />
                                </div>
                                <div className="formInput">

                                    <label>MRP</label>
                                    <input type="text" value={products[selectedIndex].MRP}
                                        onChange={(e) => setProductID(e.target.value)} />
                                </div>
                                <div className="formInput">

                                    <label>Price</label>
                                    <input type="text" value={products[selectedIndex].price}
                                        onChange={(e) => setProductID(e.target.value)} />
                                </div>
                                <button onClick={() =>
                                    handleUpdate()}
                                >Update</button>
                            </form>
                        </div>

                    </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default Products