import './navbar.scss'
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
const Navbar = () => {



    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: 0,
            top: 3,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: '0 4px',
        },
    }));
    return (
        <div className='navbar'>

            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder='Search....' />
                    <SearchOutlinedIcon />

                </div>
                {/* <div className="items">
                    <div className="item">
                        <LanguageOutlinedIcon className='icon' />
                        English
                    </div>
                    <div className="item">
                        <DarkModeOutlinedIcon className='icon' />

                    </div>
                    <div className="item">

                        <FullscreenExitOutlinedIcon className='icon' />


                    </div>
                    <div className="item">
                        <StyledBadge badgeContent={4} color="secondary">
                            <NotificationsNoneOutlinedIcon className='icon' />
                        </StyledBadge>

                    </div>
                    <div className="item">
                        <StyledBadge badgeContent={11} color="secondary">
                            <ChatBubbleOutlineOutlinedIcon className='icon' />

                        </StyledBadge>
                    </div>
                    <div className="item">
                        <ListOutlinedIcon className='icon' />

                    </div>
                    <div className="item">
                        <img
                            src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className="avatar" />

                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Navbar