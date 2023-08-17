import { useEffect, useState } from "react";

import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";
import categoryService from "../services/category.service";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Shared from "../utils/shared";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const EditCategory = () => {
  const navigate = useNavigate();
  const initialValues = { name: "" };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getCategoryById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
  });

  const getCategoryById = () => {
    categoryService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
      });
    });
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValueState,
      validationSchema: validationSchema,
      enableReinitialize: true,
      onSubmit: (values) => {
        categoryService
          .save(values)
          .then((res) => {
            toast.success(Shared.messages.UPDATED_SUCCESS);
            navigate("/category");
          })
          .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
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
          Category
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Category Name *
            </Typography>
            <TextField
              type="text"
              size="small"
              fullWidth
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.name && touched.name ? errors.name : null}
              error={errors.name && touched.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
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
              sx={{
                textTransform: "capitalize",
                marginLeft: "1rem",
                backgroundColor: "#ea3c53",
                "&:hover": {
                  backgroundColor: "#e60026",
                },
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditCategory;