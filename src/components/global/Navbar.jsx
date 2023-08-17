import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../../assets/images/site-logo.svg";

import { Link } from "react-router-dom";

import { RoutePaths } from "./../../utils/enum";
import Shared from "../../utils/shared";
import { useMemo } from "react";

import { useAuthContext } from "../../context/auth";
import { Chip } from "@mui/material";

const linkStyle = {
  textDecoration: "none",
};

const Navbar = () => {

  const authContext = useAuthContext();

  const items = useMemo(() => {
    return Shared.NavigationItems.filter(
      (item) =>
        !item.access.length || item.access.includes(authContext.user.roleId)
    );
  }, [authContext.user]);

  const logOut = () => {
    authContext.signOut();
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "92px",
        }}
      >
        <Link
          to={RoutePaths.BookListing}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img src={logo} alt="logo" style={{ width: "180px" }} />
        </Link>

        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!!authContext.user.id && (
            <Chip
              label={`Welcome, ${authContext.user.firstName} ${authContext.user.lastName}`}
              sx={{ backgroundColor: "#ffdbd3", fontSize: "16px" }}
            />
          )}

          <Stack
            direction="row"
            spacing={1}
            divider={<Divider orientation="vertical" flexItem />}
          >
            {!authContext.user.id && (
              <>
                <Link to={RoutePaths.Login} style={linkStyle}>
                  <Button
                    variant="text"
                    color="error"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to={RoutePaths.Registation} style={linkStyle}>
                  <Button
                    variant="text"
                    color="error"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
            {items.map((item, index) => {
              return (
                <Link to={item.route} style={linkStyle} key={index}>
                  <Button
                    variant="text"
                    color="error"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            {/* <Link to="/book" style={linkStyle}>
              <Button
                variant="text"
                color="error"
                sx={{ textTransform: "capitalize" }}
              >
                Books
              </Button>
            </Link> */}
          </Stack>
          <Link to="/cart" style={linkStyle}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ShoppingCartIcon style={{ color: "#c62828" }} />}
            >
              <span style={{ color: "#c62828", marginRight: "5px" }}>0</span>
              Cart
            </Button>
          </Link>
          {!!authContext.user.id && (
            <Link to="/book" style={linkStyle}>
              <Button
                variant="text"
                color="error"
                sx={{ textTransform: "capitalize" }}
                onClick={logOut}
              >
                Logout
              </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Navbar;