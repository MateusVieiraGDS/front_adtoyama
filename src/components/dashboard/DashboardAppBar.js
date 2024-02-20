'use client'

import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import KeyboardDoubleArrowLeft from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Hidden, Stack } from '@mui/material';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../Auth/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

//---------------------------------------------------------------------------------------------------------------------


const drawerWidth = 200;
const transitionSettings = 'all 300ms ease';

const sideOptions = [
  {
    'icon': <NotificationsIcon/>,
    'title': 'Inicio',
    'link': '/dashboard'
  },
  {
    'icon': <NotificationsIcon/>,
    'title': 'Cadastros',
    'link': '/dashboard/cadastros'
  },
  {
    'icon': <NotificationsIcon/>,
    'title': 'Calendários',
    'link': '/dashboard/calendarios'
  }
];



const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

//----------------------------------------------------------------------------------------------------------------------


export default function DashboardAppBar({children, window, notificationsCount = 0}) {  
  const router = useRouter();  
  const pathname = usePathname();

  const {signout} = React.useContext(AuthContext);

  async function handleLogout(){
      signout();
  }


    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMobileMenuClose = () => {
      setMobileMoreAnchorEl(null);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      handleMobileMenuClose();
    };
  
    const handleMobileMenuOpen = (event) => {
      setMobileMoreAnchorEl(event.currentTarget);
    };
    
    const bePathCompare = (link) =>{
      if(link == '/dashboard')
        return link == pathname;
      return pathname.startsWith(link);
    }
  
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
        <MenuItem onClick={handleMenuClose}>Opções</MenuItem>
        <Divider></Divider>
        <MenuItem onClick={handleLogout}>Sair</MenuItem>
      </Menu>
    );
  
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        {/* <MenuItem>
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem> */}
        <MenuItem>
          <IconButton
            size="large"
            aria-label={`Show ${notificationsCount} new notifications`}
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    //-----------------------------------------------------------------



  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleDrawerMinimize = () => {
    setIsMinimized( v => !v);
  };


  const drawer = (
    <div>
      <Toolbar />
        <Stack justifyContent="center" alignItems='center' flex={1} 
          sx={{
            transition: transitionSettings, 
            width: (isMinimized ? '3.5em' : drawerWidth),
            display: {
              xs: 'none', md: 'flex'
            }
          }}
        >
            <Stack justifyContent="center" alignItems='end' sx={{
                boxShadow: 'inset #6b6b6b4f  0 0 0.2em',
                padding: '0.2em',
                height: '1.6em',
                transition: transitionSettings, 
                width: (isMinimized ? '3.5em' : drawerWidth)
            }}>                
                <Box onClick={handleDrawerMinimize} sx={{
                        height: '100%',
                        boxShadow: '#49494994 0 0 0.2em',
                        border: 'none',
                        width: (isMinimized ? '100%' : '2em'),
                        transition: transitionSettings,
                        transitionDelay: '300ms',
                        textAlign: 'center',
                        '&:hover': {
                            opacity: '.8',
                            cursor: 'pointer'
                        }
                }}>
                    <KeyboardDoubleArrowLeft 
                        sx={{
                            color: 'gray',
                            fontSize: '1.3em',
                            rotate: (isMinimized ? '180deg' : '0deg'),
                            transition: transitionSettings,
                            transitionDelay: '300ms'
                        }}
                    />     
                </Box>                
            </Stack>  
        </Stack> 
      <List>
        {sideOptions.map((data) => (
            <ListItem  disablePadding key={data.title} onClick={()=>{router.push(data.link)}}
            sx={{
              ...{
                transition: 'margin 200ms',
                '&:hover': {
                  marginLeft: '.5em'
                }
              },
              ...(bePathCompare(data.link) == false ? {} : {
                marginLeft: '.5em',
                boxShadow:' #3f3f3f2e  0 0 0.5em'
              })
            }}>
              
              <ListItemButton>
                <ListItemIcon>
                  {data.icon}
                </ListItemIcon>
                <ListItemText primary={data.title} />
              </ListItemButton>
            </ListItem>
        ))}
      </List>
    </div>
  );
  
  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

    return ( 
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
            >
                <MenuIcon />
            </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            Secretaria A.D Toyama
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              size="large"
              aria-label={`show ${notificationsCount} new notifications`}
              color="inherit"
            >
              <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Box
        component="nav"
        sx={{ width: { md: (isMinimized ? '3.5em' : drawerWidth), transition: transitionSettings }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', transition: transitionSettings, width: (isMinimized ? '3.5em' : drawerWidth), overflowX: 'hidden' },
            '& .MuiDrawer-paper > div': { width: drawerWidth}
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
          <Box>
            {children}
          </Box>
      </Box>
    </Box>
    );
};

DashboardAppBar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
};