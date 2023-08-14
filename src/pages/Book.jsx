// import BookCard from "../components/global/Book/BookCard";
// import Stack from "@mui/material/Stack";

import ConfirmationDialog from "../components/global/ConfirmationDialog";
import bookService from "../services/book.service";
import categoryService from "../services/category.service";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Container,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { toast } from "react-toastify";
import Shared from "../utils/shared";
import { useNavigate } from "react-router-dom";

const Book = () => {
  const [filters, setFilters] = useState({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });
  const [bookRecords, setBookRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllBooks({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllBooks = (filters) => {
    bookService.getAll(filters).then((res) => {
      setBookRecords(res);
    });
  };

  const onConfirmDelete = () => {
    bookService
      .deleteBook(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters, pageIndex: 1 });
      })
      .catch((e) => toast.error(Shared.messages.DELETE_FAIL));
  };
  return (
    <Container maxWidth="lg" sx={{ paddingY: "1rem" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: 600 }}
          textAlign="center"
        >
          Book Page
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginY: "1rem",
        }}
      >
        <TextField
          type="text"
          placeholder="Search Book"
          size="small"
          sx={{ width: "40%", backgroundColor: "#fafafa", flexWrap: "wrap" }}
          onChange={(e) => {
            setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
          }}
        />
        <Button
          variant="outlined"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => navigate("/add-book")}
        >
          ADD BOOK
        </Button>
      </Box>
      {/* <ConfirmationDialog/> */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>Book Name</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookRecords?.items?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">
                  <img src={row.base64image} style={{ height: "5rem" }} />
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.price}</TableCell>
                <TableCell align="center">
                  {" "}
                  {categories.find((c) => c.id === row.categoryId)?.name}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    onClick={() => {
                      navigate(`/edit-book/${row.id}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ marginLeft: "0.5rem" }}
                    onClick={() => {
                      setOpen(true);
                      setSelectedId(row.id ?? 0);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!bookRecords.items.length && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography align="center">No Books</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 5, 10, 20]}
        component="div"
        count={bookRecords.totalItems}
        rowsPerPage={filters.pageSize || 0}
        page={filters.pageIndex - 1}
        onPageChange={(e, newPage) => {
          setFilters({ ...filters, pageIndex: newPage + 1 });
        }}
        onRowsPerPageChange={(e) => {
          setFilters({
            ...filters,
            pageIndex: 1,
            pageSize: Number(e.target.value),
          });
        }}
      />
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onConfirmDelete()}
        title="Delete book"
        description="Are you sure to delete the book"
      />
    </Container>
  );
};

export default Book;