// import React from "react";
// import Logo from "../../assets/logo.png";

// const Footer = () => {
//   return (
//     <>
//       <footer>
//         <div className="footer_div">
//           <img src={Logo} alt="logo" />
//           <p> &#169; 2015 Tatvasoft.com. All rights reseved </p>
//         </div>
//       </footer>
//     </>
//   );
// };

// export default Footer;

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import logo from "../../assets/images/site-logo.svg";
const Footer = () => {
  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        marginTop: "auto",
      }}
    >
      <img src={logo} alt="logo" style={{ height: "40px" }} />
      <Typography
        variant="body1"
        gutterBottom
        sx={{ color: "grey", marginTop: "5px" }}
      >
        @2023 Tatvasoft.com All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;