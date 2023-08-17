import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Chip, Stack } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const BookCard = ({ name, price, description, category, img }) => {
  return (
    <>
      <div
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          border: "1px solid #d4d4d4",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: "1rem",
            height: "100%",
            overflow: "hidden",
            // borderRadius: "1rem",
            // border: "1px solid #d4d4d4",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              width: "40%",
              // backgroundColor: "#eeee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={img}
              alt="book image"
              style={{ height: "12rem", objectFit: "cover" }}
            />
          </div>
          <Stack
            alignItems="flex-start"
            useFlexGap
            spacing={1}
            sx={{ height: "100%", paddingY: "0.5rem", width: "50%" }}
          >
            <div
              style={{
                // backgroundColor: "orange",
                border: "1px solid #ea3c53",
                borderRadius: "10px",
              }}
            >
              <Typography
                style={{ margin: "5px 15px", color: "#ea3c53" }}
                variant="h6"
              >
                {name}
              </Typography>
            </div>
            <Chip label={category} sx={{ backgroundColor: "#e0e8eb" }} />

            {/* <Typography variant="body2" color="text.secondary">
          {description}
        </Typography> */}
            <Typography variant="h6">&#8377; {price}</Typography>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              sx={{
                marginTop: "auto",
                backgroundColor: "#ea3c53",
                "&:hover": {
                  backgroundColor: "#e60026",
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#f7f3f3ed",
          }}
        >
          <Typography
            style={{
              margin: "5px 10px",
            }}
            variant="body2"
            color="text.secondary"
          >
            &nbsp;&nbsp;&nbsp;{description}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default BookCard;