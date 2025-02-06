const express = require("express");
const router = express.Router();
// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")(
//   "sk_test_51IYnC0SIR2AbPxU0EiMx1fTwzbZXLbkaOcbc2cXx49528d9TGkQVjUINJfUDAnQMVaBFfBDP5xtcHCkZG1n1V3E800U7qXFmGf"
// );
const Order = require("../models/orderModel");
router.post("/placeorder", async (req, res) => {
  const { subtotal, currentUser, cartItems } = req.body;

  try {
    // const customer = await stripe.customers.create({
    //   email: token.email,
    //   source: token.id,
    // });

    //   const payment = await stripe.charges.create({
    //       amount:subtotal*100,
    //       currency:'inr',
    //       customer : customer.id,
    //       receipt_email : token.email
    //   }, {
    //       idempotencyKey : uuidv4()
    //   })

    const neworder = new Order({
      name: currentUser.name,
      email: currentUser.email,
      userid: currentUser._id,
      orderItems: cartItems,
      orderAmount: subtotal,
    });

    neworder.save();

    res.send("Order placed successfully");
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" + error });
  }
});

router.post("/getuserorders", async (req, res) => {
  const { userid } = req.body;
  try {
    const orders = await Order.find({ userid: userid }).sort({ _id: -1 });
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/getallorders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/deliverorder", async (req, res) => {
  const orderid = req.body.orderid;
  try {
    const order = await Order.findOne({ _id: orderid });
    order.isDelivered = true;
    await order.save();
    res.send("Order Delivered Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
