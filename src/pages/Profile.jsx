import { AuthContext, useAuthContext } from "../context/auth";
import { useFormik } from "formik";
import * as Yup from "yup";

import userService from "../services/user.service";
import { toast } from "react-toastify";
import Shared from "../utils/shared";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const Profile = () => {
  const authContext = useAuthContext();

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const initialValueState = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    newPassword: "",
    confirmPassword: "",
  };

  const [updatePassword, setUpdatePassword] = useState(false);

  const profileSchema = Yup.object({
    firstName: Yup.string()
      .min(2)
      .max(25)
      .required("please enter your first name"),
    lastName: Yup.string()
      .min(2)
      .max(25)
      .required("please enter your last name"),
    email: Yup.string().email().required("Please enter your email"),
    newPassword: Yup.string()
      .min(6)
      .required("Please enter password with min 6 char"),
    confirmPassword: updatePassword
      ? Yup.string()
          .required("Must required")
          .oneOf([Yup.ref("newPassword")], "Passwords is not match")
      : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValueState,
      validationSchema: profileSchema,
      enableReinitialize: true,
      onSubmit: (values) => {
        //kuchh
        const password = values.newPassword
          ? values.newPassword
          : user.password;
        delete values.confirmPassword;
        delete values.newPassword;

        const data = Object.assign(user, { ...values, password });
        delete data._id;
        delete data.__v;
        userService
          .updateProfile(data)
          .then((res) => {
            authContext.setUser(res);
            toast.success(Shared.messages.UPDATED_SUCCESS);
            navigate("/");
          })
          .catch((e) => {
            console.log(e);
            toast.error(Shared.messages.UPDATED_FAIL);
          });
      },
    });

  return (
    <Container maxWidth="lg" sx={{ margin: "1.5rem auto" }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box>
            <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
              Personal Information
            </Typography>

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
                  helperText={
                    errors.email && touched.email ? errors.email : null
                  }
                  error={errors.email && touched.email}
                />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
              Login Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="body1" gutterBottom>
                  Password *
                </Typography>
                <TextField
                  type="password"
                  size="small"
                  fullWidth
                  name="newPassword"
                  value={values.newPassword}
                  onChange={(e) => {
                    e.target.value !== ""
                      ? setUpdatePassword(true)
                      : setUpdatePassword(false);
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  helperText={
                    errors.newPassword && touched.newPassword
                      ? errors.newPassword
                      : null
                  }
                  error={errors.newPassword && touched.newPassword}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" gutterBottom>
                  Confirm Password *
                </Typography>
                <TextField
                  type="password"
                  size="small"
                  fullWidth
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : null
                  }
                  error={errors.confirmPassword && touched.confirmPassword}
                />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#80bf32",

                "&:hover": {
                  backgroundColor: "#339933",
                },
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                textTransform: "capitalize",
                marginLeft: "1rem",
                backgroundColor: "#ea3c53",
                "&:hover": {
                  backgroundColor: "#e60026",
                },
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default Profile;