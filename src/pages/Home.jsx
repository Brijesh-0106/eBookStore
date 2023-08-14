// import React from "react";

// const Home = () => {
//   return (
//     <>
//       <div
//         style={{
//           height: "56vh",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <h1>Home Page</h1>
//       </div>
//     </>
//   );
// };

// export default Home;

import { Container, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useState } from "react";
const Home = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter((prev) => prev + 1);
  };

  const decrement = () => {
    setCounter((prev) => prev - 1);
  };

  const reset = () => {
    setCounter(0);
  };

  return (
    <>
      <Container maxWidth="lg">
        <h1>Home Page</h1>
        <Typography gutterBottom variant="h5" component="div">
          {counter}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <Button size="small" variant="contained" onClick={increment}>
            Increment
          </Button>
          <Button size="small" variant="contained" onClick={decrement}>
            Decrement
          </Button>
          <Button size="small" variant="contained" onClick={reset}>
            Reset
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Home;