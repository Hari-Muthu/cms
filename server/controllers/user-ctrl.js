const UserModel = require("../models/user-model");
const MenuModel = require("../models/menu-model");
const OrderModel = require("../models/order-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createJWT } = require("../utils/auth");

getMenu = (req, res) => {
  MenuModel.find({}, (err, menuItems) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    } else if (!menuItems) {
      return res.status(404).json({
        success: false,
        error: "No items found",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: menuItems.filter((item) => item.stock != 0),
      });
    }
  });
};

placeOrder = (req, res) => {
  const { email, orderedItems } = req.body;
  const currentOrderItems = [];
  let flag = 1;
  MenuModel.find({}, (err, menuItems) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    } else if (!menuItems) {
      return res
        .status(400)
        .json({ success: false, message: "No items found" });
    } else {
      orderedItems.forEach((orderItem) => {
        menuItems.forEach((menuItem) => {
          if (menuItem.name === orderItem.itemName) {
            if (menuItem.stock >= orderItem.quantity)
              currentOrderItems.push({
                itemName: orderItem.itemName,
                quantity: orderItem.quantity,
                price: orderItem.quantity * menuItem.price,
              });
            else {
              flag = 0;
            }
          }
        });
      });
      if (flag === 0) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock of some items",
        });
      } else {
        const newOrder = new OrderModel({
          email: email,
          orderedItems: currentOrderItems,
        });
        newOrder.save((err, order) => {
          if (err) res.status(400).json({ success: false, error: err });
          else res.status(200).json({ success: true, data: order });
        });
      }
    }
  });
};

// login = (req, res) => {
//   const { email, password } = req.body;
//   UserModel.findOne({ email }, (err, user) => {
//     if (err) {
//       return res.status(400).json({ success: false, error: err });
//     } else if (!user) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     } else if (user.password !== password) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Password incorrect" });
//     }
//     return res.status(200).json({ success: true, data: user });
//   });
// };

// register = (req, res) => {
//   const { name, email, phoneno, password } = req.body;
//   UserModel.findOne({ email }, (err, user) => {
//     if (err) {
//       return res.status(400).json({ success: false, error: err });
//     } else if (user) {
//       return res
//         .status(404)
//         .json({ success: false, error: "User already exists" });
//     } else {
//       const user = new UserModel({ name, email, phoneno, password });
//       user.save((err, user) => {
//         if (err) {
//           return res.status(400).json({ success: false, error: err });
//         } else {
//           return res.status(200).json({ success: true, data: user });
//         }
//       });
//     }
//   });
// };

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

register = (req, res, next) => {
  let { name, email,phoneno, password, password_confirmation } = req.body;
  let errors = [];
  if (!name) {
    errors.push({ name: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!phoneno) {
    errors.push({ phoneno: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
      password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res
          .status(422)
          .json({ errors: [{ user: "email already exists" }] });
      } else {
        const user = new UserModel({
          name: name,
          phoneno: phoneno,
          email: email,
          password: password,
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then((response) => {
                res.status(200).json({
                  success: true,
                  result: response,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  errors: [{ error: err }],
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ error: "Something went wrong" }],
      });
    });
};


login = (req, res) => {
  let { email, password } = req.body;
  let errors = [];
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid email" });
  }
  if (!password) {
    errors.push({ passowrd: "required" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "not found" }],
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res
                .status(400)
                .json({ errors: [{ password: "incorrect" }] });
            }
            let access_token = createJWT(user.email, user._id, 3600);
            jwt.verify(
              access_token,
              process.env.TOKEN_SECRET,
              (err, decoded) => {
                if (err) {
                  res.status(500).json({ erros: err });
                }
                if (decoded) {
                  return res.status(200).json({
                    success: true,
                    token: access_token,
                    message: user,
                  });
                }
              }
            );
          })
          .catch((err) => {
            res.status(500).json({ erros: err });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ erros: err });
    });
};

module.exports = {
  getMenu,
  placeOrder,
  login,
  register,
};
