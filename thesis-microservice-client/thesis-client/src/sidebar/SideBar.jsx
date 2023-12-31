import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import "./SideBar.css";
import {
  SidebarDataAdmin,
  SidebarDataManager,
  SidebarDataSeller,
  SidebarDataUpdater,
} from "./SideBarData";
import { Outlet } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(10)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [nameComponent, setNameComponent] = useState(
    "Chào mừng quản trị viên của P&P SHOP"
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const sidebarItem = () => {
    if (user && user.roles?.includes("ROLE_ADMIN")) {
      return SidebarDataAdmin;
    }
    if (user && user.roles?.includes("ROLE_SELLER")) {
      return SidebarDataSeller;
    }
    if (user && user.roles?.includes("ROLE_UPDATER")) {
      return SidebarDataUpdater;
    }
    if (user && user.roles?.includes("ROLE_MANAGER")) {
      return SidebarDataManager;
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
                <Typography variant="h6" noWrap component="div">
                  {nameComponent}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton sx={{ p: 0 }} onClick={handleMenu}>
                    <Avatar src="/broken-image.jpg" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <p className="cloud-text">P&P SHOP</p>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <List>
            {sidebarItem()?.map((data, index) => (
              <ListItem
                onClick={() => setNameComponent(data.title)}
                component={Link}
                key={index}
                disablePadding
                to={data.to}
                sx={{ display: "block" }}
                className={`${index === selected ? "active" : null}`}
              >
                <ListItemButton
                  selected={index === selected}
                  onClick={() => setSelected(index)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {data.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={data.title}
                    style={{ color: "black" }}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Outlet />
        </Box>
      </Box>

      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Link to="/detailUser">Cá nhân</Link>
        </MenuItem>
        <MenuItem onClick={handleLogOut}>Đăng xuất</MenuItem>
      </Menu>
    </>
  );
}
