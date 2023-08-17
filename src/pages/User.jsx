import {
    Box,
    Button,
    Chip,
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
  
  import userService from "../services/user.service";
  import { toast } from "react-toastify";
  import { useAuthContext } from "../context/auth";
  import ConfirmationDialog from "../components/global/ConfirmationDialog";
  import Shared from "../utils/shared";
  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  const User = () => {
    const authContext = useAuthContext();
    const [filters, setFilters] = useState({
      pageIndex: 1,
      pageSize: 5,
      keyword: "",
    });
    const [userList, setUserList] = useState({
      pageIndex: 0,
      pageSize: 5,
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
        getAllUsers({ ...filters });
      }, 5);
      return () => clearTimeout(timer);
    }, [filters]);
  
    const getAllUsers = async (filters) => {
      await userService.getAllUsers(filters).then((res) => {
        if (res) {
          setUserList(res);
        }
      });
    };
  
    const onConfirmDelete = async () => {
      await userService
        .deleteUser(selectedId)
        .then((res) => {
          if (res) {
            toast.success(Shared.messages.DELETE_SUCCESS);
            setOpen(false);
            setFilters({ ...filters });
          }
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
            User
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
            placeholder="Search User"
            size="small"
            sx={{ width: "40%", backgroundColor: "#fafafa", flexWrap: "wrap" }}
            onChange={(e) => {
              setFilters({ ...filters, keyword: e.target.value, pageIndex: 1 });
            }}
          />
        </Box>
        {/* <ConfirmationDialog/> */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell align="left">Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList?.items?.map((user, index) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={`${user.id}__${user.email}`}
                >
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell align="left">{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={user.role}
                      color={user.roleId === 1 ? "warning" : "info"}
                      variant="contained"
                    />
                  </TableCell>
  
                  <TableCell align="right">
                    {user.id !== authContext.user.id && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          color="info"
                          onClick={() => {
                            navigate(`/edit-user/${user.id}`);
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
                            setSelectedId(user.id ?? 0);
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
  
                    {!userList?.items?.length && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography align="center">No Users</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[2, 5, 10, 20]}
          component="div"
          count={userList?.totalItems || 0}
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
          title="Delete user"
          description={Shared.messages.USER_DELETE}
        />
      </Container>
    );
  };
  
  export default User;