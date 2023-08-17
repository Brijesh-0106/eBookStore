import {
    Box,
    Button,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";
  
  import cartService from "../services/cart.service";
  import { useAuthContext } from "../context/auth";
  import { toast } from "react-toastify";
  import orderService from "../services/order.service";
  import Shared from "../utils/shared";
  import { useCartContext } from "../context/cart";
  import { useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  
  const Cart = () => {
    const authContext = useAuthContext();
    const cartContext = useCartContext();
    const navigate = useNavigate();
  
    const [cartList, setCartList] = useState([]);
    const [itemsInCart, setItemsInCart] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
  
    const getTotalPrice = (itemList) => {
      let totalPrice = 0;
      itemList.forEach((item) => {
        const itemPrice = item.quantity * parseInt(item.book.price);
        totalPrice = totalPrice + itemPrice;
      });
      setTotalPrice(totalPrice);
    };
  
    useEffect(() => {
      setCartList(cartContext.cartData);
      setItemsInCart(cartContext.cartData.length);
      getTotalPrice(cartContext.cartData);
      console.log(cartList);
    }, [cartContext.cartData]);
  
    const removeItem = async (id) => {
      try {
        const res = await cartService.removeItem(id);
        if (res) {
          cartContext.updateCart();
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    };
  
    const updateQuantity = async (cartItem, inc) => {
      const currentCount = cartItem.quantity;
      const quantity = inc ? currentCount + 1 : currentCount - 1;
      if (quantity === 0) {
        toast.error("Item quantity should not be zero");
        return;
      }
  
      try {
        const res = await cartService.updateItem({
          id: cartItem.id,
          userId: cartItem.userId,
          bookId: cartItem.book.id,
          quantity,
        });
        if (res) {
          const updatedCartList = cartList.map((item) =>
            item.id === cartItem.id ? { ...item, quantity } : item
          );
          cartContext.updateCart(updatedCartList);
          const updatedPrice =
            totalPrice +
            (inc
              ? parseInt(cartItem.book.price)
              : -parseInt(cartItem.book.price));
          setTotalPrice(updatedPrice);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    };
  
    const placeOrder = async () => {
      if (authContext.user.id) {
        const userCart = await cartService.getList(authContext.user.id);
        if (userCart.length) {
          try {
            let cartIds = userCart.map((element) => element.id);
            const newOrder = {
              userId: authContext.user.id,
              cartIds,
            };
            const res = await orderService.placeOrder(newOrder);
            if (res) {
              cartContext.updateCart();
              navigate("/");
              toast.success(Shared.messages.ORDER_SUCCESS);
            }
          } catch (error) {
            toast.error(`Order cannot be placed ${error}`);
          }
        } else {
          toast.error("Your cart is empty");
        }
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
            Cart Page
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Total Items : {itemsInCart} </Typography>
          <Typography variant="h6">Total Price : &#8377; {totalPrice}</Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartList.map((cartItem) => {
                return (
                  <TableRow key={cartItem.id}>
                    <TableCell align="center" sx={{ backgroundColor: "#eeee" }}>
                      <img
                        src={cartItem.book.base64image}
                        style={{ height: "5rem" }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {cartItem.book.name}
                    </TableCell>
                    <TableCell align="center">
                      &#8377; {cartItem.book.price}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "1rem",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => updateQuantity(cartItem, false)}
                        >
                          -
                        </Button>
                        <Typography>{cartItem.quantity}</Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => updateQuantity(cartItem, true)}
                        >
                          +
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{ marginLeft: "0.5rem" }}
                        onClick={() => removeItem(cartItem.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ marginY: "2rem" }}>
          <Button
            variant="contained"
            size="large"
            color="error"
            sx={{
              backgroundColor: "#ea3c53",
              "&:hover": {
                backgroundColor: "#e60026",
              },
            }}
            onClick={placeOrder}
          >
            Place Order
          </Button>
        </Box>
      </Container>
    );
  };
  
  export default Cart;