import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import categoryService from "../services/category.service";
import { toast } from "react-toastify";
import ConfirmationDialog from "../components/global/ConfirmationDialog";
import Shared from "../utils/shared";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

const Category = () => {
  const [filters, setFilters] = useState({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });
  const [categoryRecords, setCategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecords(res);
    });
  };

  const onConfirmDelete = () => {
    categoryService
      .deleteCategory(selectedId)
      .then((res) => {
        toast.success(Shared.messages.DELETE_SUCCESS);
        setOpen(false);
        setFilters({ ...filters });
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
          Category
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
          onClick={() => navigate("/add-category")}
        >
          ADD CATEGORY
        </Button>
      </Box>
      {/* <ConfirmationDialog/> */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Book Name</TableCell>

              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryRecords?.items?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    onClick={() => {
                      navigate(`/edit-category/${row.id}`);
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
            {!categoryRecords.items.length && (
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
        rowsPerPageOptions={[2, 5, 10]}
        component="div"
        count={categoryRecords?.totalItems || 0}
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
        title="Delete category"
        description="Are you sure you want to delete this category?"
      />
    </Container>
  );
};

export default Category;