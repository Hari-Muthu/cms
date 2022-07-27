const express=require('express');

const router = express.Router();

const adminCtrl = require("../controllers/admin-ctrl");

router.post("/adminLogin",adminCtrl.login);
router.get("/getOrders",adminCtrl.getOrders);
router.patch("/updateMenu/:id",adminCtrl.updateMenu);

module.exports = router;