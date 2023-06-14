import './sidebar.scss'
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StoreIcon from "@mui/icons-material/Store";
import ContactlessOutlinedIcon from '@mui/icons-material/ContactlessOutlined';
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="top">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">Pulze</span>
                </Link>

            </div>
            <hr />
            <div className="centre">
                <div className="arrow">

                    <KeyboardDoubleArrowLeftIcon className='arrowElement' />
                </div>
                <ul>
                    <p className='title'>MAIN</p>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </Link>
                    <p className='title'>LIST</p>
                    <Link to="/users" style={{ textDecoration: "none" }}>

                        <li>
                            <PersonOutlineIcon className="icon" />
                            <span>Users</span>
                        </li>
                    </Link>
                    <Link to="/orders" style={{ textDecoration: "none" }}>
                        <li>
                            <ShoppingCartOutlinedIcon className="icon" />
                            <span>Orders</span>
                        </li>
                    </Link>
                    {/* <li>
                        <LocalShippingIcon className="icon" />
                        <span>Delivery</span>
                    </li> */}
                    <Link to="/products" style={{ textDecoration: "none" }}>
                        <li>
                            <StoreIcon className="icon" />

                            <span>Products</span>
                        </li>
                    </Link>
                    <p className='title'>USEFUL</p>

                    <li>
                        <ContactlessOutlinedIcon className="icon" /><span>
                            Taps</span>
                    </li>
                    <li>
                        <SaveOutlinedIcon className="icon" /><span>Log</span>
                    </li>
                    <p className='title'>SERVICE</p>
                    <li>
                        <SettingsSystemDaydreamOutlinedIcon className="icon" />
                        <span> System Health</span>
                    </li>
                    <li>
                        <PsychologyOutlinedIcon className="icon" />
                        <span>Logs</span>
                    </li>
                    <li>
                        <SettingsApplicationsIcon className="icon" />
                        <span>Settings</span>
                    </li>
                    <p className='title'>USER</p>
                    <li>
                        <AccountCircleOutlinedIcon className="icon" />
                        <span>Profile</span>
                    </li>
                    <li>
                        <ExitToAppIcon className="icon" />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
            {/* <div className="bottom">

                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div> */}
        </div>
    )
}

export default Sidebar