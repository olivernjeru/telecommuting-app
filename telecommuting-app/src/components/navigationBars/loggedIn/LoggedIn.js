import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import SettingsIcon from '@mui/icons-material/Settings';
import ProfileIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from '@mui/material';
import { useAuth } from '../../authentication/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoggedIn() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
  };

  const navigateToSettings = () => {
    navigate('/account-settings');
  }

  const navigateToProfile = () => {
    navigate('/account-profile');
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEmailClick = (event) => {
    event.stopPropagation();
  };


  return (
    <AppBar>
      <Toolbar>
        <div className="left" style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/">Nexus Care</Link>
        </div>
        <div className="right">
          <Tooltip title="Account menu" sx={{ color: 'white' }}>
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }} src={userData?.profilePictureUrl} />
            </IconButton>
          </Tooltip>
        </div>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {userData && userData.displayName && (
            <div
              onClick={handleEmailClick}
              style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 1, paddingBottom: 1, cursor: 'default' }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{userData.displayName}</span>
              <br />
              <span style={{ fontSize: '1rem' }}>{currentUser.email}</span>
            </div>
          )}
          <Divider sx={{ backgroundColor: 'white' }} />
          <MenuItem onClick={navigateToSettings} sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <SettingsIcon sx={{ marginRight: '17px', marginLeft: '-5px' }} /> Settings
          </MenuItem>
          <MenuItem onClick={navigateToProfile} sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <ProfileIcon sx={{ marginRight: '17px', marginLeft: '-5px' }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => signOut()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
