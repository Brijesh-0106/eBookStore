import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { List, ListItem, Stack, Typography } from "@mui/material";

import bookService from "../../services/book.service";
import {useState } from "react";

const SearchBar = () => {
  const [query, setquery] = useState("");
  const [bookList, setbookList] = useState([]);
  const [openSearchResult, setOpenSearchResult] = useState(false);

  const searchBook = async () => {
    const res = await bookService.searchBook(query);
    setbookList(res);
  };

  const search = () => {
    document.body.classList.add("search-results-open");
    searchBook();
    setOpenSearchResult(true);
  };

  return (
    <>
      <div
        className="search-overlay"
        onClick={() => {
          setOpenSearchResult(false);
          document.body.classList.remove("search-results-open");
        }}
      ></div>
      <Box
        sx={{
          height: "80px",
          display: "flex",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <TextField
          type="text"
          placeholder="What are you looking for ..."
          size="small"
          sx={{ width: "422px" }}
          value={query}
          onChange={(e) => setquery(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{
            textTransform: "capitalize",
            backgroundColor: "#80bf32",
            "&:hover": {
              backgroundColor: "#339933",
            },
          }}
          startIcon={<SearchIcon />}
          onClick={search}
        >
          Search
        </Button>

        {openSearchResult && (
          <Box
            sx={{
              position: "absolute",
              top: "70px",
              backgroundColor: "#dedede",
              width: "75%",
              zIndex: 2,
              borderRadius: "0.5rem",
            }}
          >
            {bookList?.length === 0 && (
              <p className="no-product">No product found</p>
            )}

            <List>
              {bookList?.length > 0 &&
                bookList.map((item, i) => {
                  return (
                    <ListItem sx={{ display: "flex" }} key={item.name}>
                      <Stack sx={{ flexGrow: "1" }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body1">
                          {item.description}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={4}>
                        <Typography variant="h6">Rs. {item.price}</Typography>
                        <Button variant="contained" onClick={() => {}}>
                          Add to Cart
                        </Button>
                      </Stack>
                    </ListItem>
                  );
                })}
            </List>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SearchBar;