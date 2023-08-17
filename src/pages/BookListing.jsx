import BookCard from "../components/global/Book/BookCard";

import bookService from "../services/book.service";
import categoryService from "../services/category.service";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const BookListing = () => {
  const [bookResponse, setBookResponse] = useState({
    pageIndex: 0,
    pageSize: 2,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState({
    pageIndex: 1,
    pageSize: 4,
    keyword: "",
  });

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookResponse(res);
    });
  };

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
        console.log(res);
      }
    });
  };

  const books = useMemo(() => {
    const bookList = [...bookResponse.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      if (category === 0) {
        return bookList;
      }
      let newArr = bookList.filter((ele) => {
        return ele.categoryId === category;
      });
      return newArr;
    }
    return [];
  }, [categories, bookResponse, category]);

  const sortBooks = (e) => {
    setSortBy(e.target.value);
    const bookList = [...bookResponse.items];

    bookList.sort((a, b) => {
      if (a.name < b.name) {
        return e.target.value === "a-z" ? -1 : 1;
      }
      if (a.name > b.name) {
        return e.target.value === "a-z" ? 1 : -1;
      }
      return 0;
    });
    setBookResponse({ ...bookResponse, items: bookList });
  };

  const filterByCategory = (e) => {
    setCategory(parseInt(e.target.value));
  };

  return (
    <Container maxWidth="lg" sx={{ paddingY: "1rem" }}>
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Book Listing
      </Typography>

      <Grid
        container
        sx={{ width: "100%", marginY: "1rem" }}
        columnSpacing={{ xs: 1, sm: 2, md: 5 }}
      >
        <Grid item md={4}>
          <Typography variant="h6">
            Total Items : {bookResponse.totalItems}
          </Typography>
        </Grid>
        <Grid item md={4}>
          <TextField
            type="text"
            placeholder="Search Book"
            size="small"
            sx={{ width: "100%", backgroundColor: "#fafafa" }}
            onChange={(e) => {
              setFilters({
                ...filters,
                keyword: e.target.value,
                pageIndex: 1,
              });
            }}
          />
        </Grid>
        <Grid item md={2}>
          <Select
            size="small"
            sx={{ width: "100%" }}
            onChange={sortBooks}
            value={sortBy}
          >
            <MenuItem value="a-z">A - Z</MenuItem>
            <MenuItem value="z-a">Z - A</MenuItem>
          </Select>
        </Grid>
        <Grid item md={2}>
          {/*  !!!!!!!!!  Ye vala Select optional hai kripya copy na kare */}
          <Select
            size="small"
            sx={{ width: "100%" }}
            onChange={filterByCategory}
            value={category}
          >
            <MenuItem value={0}>All</MenuItem>
            {categories.map((ele) => {
              return <MenuItem value={ele.id}>{ele.name}</MenuItem>;
            })}
          </Select>
        </Grid>
      </Grid>
      <Grid
        container
        rowSpacing={{ xs: 1, sm: 2, md: 5 }}
        columnSpacing={{ xs: 1, sm: 2, md: 5 }}
        alignItems="stretch"
        sx={{ minHeight: "2rem" }}
      >
        {books.map((ele) => {
          return (
            <Grid item sm={12} md={6} key={ele.name}>
              <BookCard
                name={ele.name}
                price={ele.price}
                category={ele.category}
                description={ele.description}
                img={ele.base64image}
              />
            </Grid>
          );
        })}
      </Grid>
      <Box sx={{ display: "flex", marginY: "1rem", justifyContent: "end" }}>
        <Pagination
          count={bookResponse.totalPages}
          page={filters.pageIndex}
          onChange={(e, newPage) => {
            setFilters({ ...filters, pageIndex: newPage });
          }}
          variant="outlined"
          shape="rounded"
          size="large"
          color="error"
        />
      </Box>
    </Container>
  );
};

export default BookListing;