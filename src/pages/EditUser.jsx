import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
  } from "@mui/material";
  import { toast } from "react-toastify";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import userService from "../services/user.service";
  import { useNavigate, useParams } from "react-router-dom";
  import { useAuthContext } from "../context/auth";
  import { useEffect, useState } from "react";
  import Shared from "../utils/shared";
  
  const userSchema = Yup.object({
    firstName: Yup.string()
      .min(2)
      .max(25)
      .required("please enter your first name"),
    lastName: Yup.string().min(2).max(25).required("please enter your last name"),
    email: Yup.string().email().required("Please enter your email"),
    roleId: Yup.number().required("Role is required"),
  });
  
  const EditUser = () => {
    const authContext = useAuthContext();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState();
    const initialValues = {
      id: 0,
      email: "",
      lastName: "",
      firstName: "",
      roleId: "",
    };
    const [initialValueState, setInitialValueState] = useState(initialValues);
    const { id } = useParams();
  
    useEffect(() => {
      getRoles();
    }, []);
  
    useEffect(() => {
      if (id) {
        getUserById();
      }
    }, [id]);
  
    useEffect(() => {
      if (user && roles.length) {
        const roleId = roles.find((role) => role.name === user?.role)?.id;
        setInitialValueState({
          id: user.id,
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
          roleId,
          password: user.password,
        });
      }
    }, [user, roles]);
  
    const getRoles = () => {
      userService.getAllRoles().then((res) => {
        if (res) {
          setRoles(res);
        }
      });
    };
  
    const getUserById = () => {
      userService.getById(Number(id)).then((res) => {
        if (res) {
          setUser(res);
        }
      });
    };
  
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
      useFormik({
        initialValues: initialValueState,
        validationSchema: userSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
          console.log(roles);
          const updatedValue = {
            ...values,
            role: roles.find((r) => r.id === values.roleId).name,
          };
          userService
            .update(updatedValue)
            .then((res) => {
              if (res) {
                toast.success(Shared.messages.UPDATED_SUCCESS);
                navigate("/user");
              }
            })
            .catch((e) => {
              console.log(e);
              toast.error(Shared.messages.UPDATED_FAIL);
            });
        },
      });
  
    return (
      <Container maxWidth="lg" sx={{ paddingY: "1rem" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontWeight: 600 }}
            textAlign="center"
          >
            Edit User
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="body1" gutterBottom>
                  First Name *
                </Typography>
                <TextField
                  type="text"
                  size="small"
                  fullWidth
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.firstName && touched.firstName
                      ? errors.firstName
                      : null
                  }
                  error={errors.firstName && touched.firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" gutterBottom>
                  Last Name *
                </Typography>
                <TextField
                  type="text"
                  size="small"
                  fullWidth
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.lastName && touched.lastName ? errors.lastName : null
                  }
                  error={errors.lastName && touched.lastName}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" gutterBottom>
                  Email Address *
                </Typography>
                <TextField
                  type="email"
                  size="small"
                  fullWidth
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errors.email && touched.email ? errors.email : null}
                  error={errors.email && touched.email}
                />
              </Grid>
  
              {values.id !== authContext.user.id && (
                <Grid item xs={6}>
                  <Typography variant="body1" gutterBottom>
                    Role *
                  </Typography>
                  <Select
                    value={values.roleId}
                    onChange={handleChange}
                    disabled={values.id === authContext.user.id}
                    onBlur={handleBlur}
                    name="roleId"
                    size="small"
                    fullWidth
                    displayEmpty
                  >
                    {roles.length > 0 &&
                      roles.map((role) => (
                        <MenuItem value={role.id} key={"name" + role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              )}
            </Grid>
          </Box>
  
          <Box sx={{ marginY: "1rem" }}>
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ textTransform: "capitalize", backgroundColor: "#f14d54" }}
            >
              Update
            </Button>
          </Box>
        </form>
      </Container>
    );
  };
  
  export default EditUser;