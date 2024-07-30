"use client";
import LogOutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { FunctionComponent } from "react";

const Navbar: FunctionComponent = () => {
  const { data: session } = useSession();

  const handleLogOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Box data-testid="navbar" sx={{ maxHeight: "64px", width: "100%", position: "fixed", top: 0, zIndex: "1100" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography data-testid="navbar-title" variant="h5" component="div" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          {session && (
            <Box display="flex" alignItems="center">
              <Box marginRight="24px">
                <Typography data-testid="user-info" lineHeight={0.75} fontWeight="bold" variant="subtitle2">
                  {session.user?.email}
                </Typography>
              </Box>
              <Button data-testid="logout-button" onClick={handleLogOut} color="inherit" startIcon={<LogOutIcon />}>
                Log Out
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
