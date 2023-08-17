import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Shared from "../utils/shared";
import bookService from "../services/book.service";
import categoryService from "../services/category.service";

const bookSchema = Yup.object().shape({
  name: Yup.string().required("Book Name is required"),
  description: Yup.string().required("Description is required"),
  categoryId: Yup.number()
    .min(1, "Category is required")
    .required("Category is required"),
  price: Yup.number().required("Price is required"),
  base64image: Yup.string().required("Image is required"),
});

const EditBook = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const initialValues = {
    name: "",
    price: "",
    categoryId: 1,
    description: "",
    base64image: "",
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getBookById();
    categoryService.getAll().then((res) => {
      setCategories(res);
    });
  }, [id]);

  const getBookById = () => {
    bookService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
        price: res.price,
        categoryId: res.categoryId,
        description: res.description,
        base64image: res.base64image,
      });
    });
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
  } = useFormik({
    initialValues: initialValueState,
    validationSchema: bookSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      bookService
        .save(values)
        .then((res) => {
          console.log(res);
          toast.success(
            values.id
              ? Shared.messages.UPDATED_SUCCESS
              : "Record created successfully"
          );
          navigate("/book");
        })
        .catch((e) => toast.error(Shared.messages.UPDATED_FAIL));
    },
  });

  const onSelectFile = (e, setFieldValue, setFieldError) => {
    const files = e.target.files;
    if (files?.length) {
      // console.log(files);
      const fileSelected = e.target.files[0];
      const fileNameArray = fileSelected.name.split(".");
      const extension = fileNameArray.pop();
      if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
        if (fileSelected.size > 50000) {
          toast.error("File size must be less then 100KB");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(fileSelected);
        reader.onload = function () {
          setFieldValue("base64image", reader.result);
          // console.log(reader.result);
        };
        reader.onerror = function (error) {
          throw error;
        };
      } else {
        toast.error("only jpg,jpeg and png files are allowed");
      }
    } else {
      setFieldValue("base64image", "");
    }
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
          Edit Product
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Book Name *
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
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Book Price (Rs) *
            </Typography>
            <TextField
              type="number"
              size="small"
              fullWidth
              name="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.price && touched.price ? errors.price : null}
              error={errors.price && touched.price}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Category *
            </Typography>
            <Select
              name="categoryId"
              size="small"
              fullWidth
              displayEmpty
              value={values.categoryId}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                errors.categoryId && touched.categoryId
                  ? errors.categoryId
                  : null
              }
              error={errors.categoryId && touched.categoryId}
            >
              {categories?.map((rl) => (
                <MenuItem value={rl.id} key={"category" + rl.id}>
                  {rl.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" gutterBottom>
              Book Image*
            </Typography>
            {!values.base64image && (
              <Button
                variant="contained"
                component="label"
                sx={{
                  textTransform: "capitalize",
                  backgroundColor: "#f14d54",
                  "&:hover": {
                    backgroundColor: "#e60026",
                  },
                }}
              >
                Upload Image
                <input
                  type="file"
                  name="base64image"
                  hidden
                  value={values.base64image}
                  onChange={(e) => {
                    onSelectFile(e, setFieldValue, setFieldError);
                  }}
                  onBlur={handleBlur}
                  helperText={
                    errors.base64image && touched.base64image
                      ? errors.base64image
                      : null
                  }
                  error={errors.base64image && touched.base64image}
                />
              </Button>
            )}

            {values.base64image && (
              <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <img
                  src={values.base64image}
                  alt=""
                  style={{ height: "8rem" }}
                />
                <Button
                  variant="outlined"
                  component="span"
                  onClick={() => {
                    setFieldValue("base64image", "");
                  }}
                >
                  Change
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Book Description*
            </Typography>
            <TextField
              type="text"
              size="small"
              multiline
              rows={4}
              fullWidth
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={
                errors.description && touched.description
                  ? errors.description
                  : null
              }
              error={errors.description && touched.description}
            />
          </Grid>
          <Grid item xs={12}>
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
                backgroundColor: "#f14d54",
                marginLeft: "10px",
              }}
              onClick={() => {
                navigate("/book");
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

export default EditBook;