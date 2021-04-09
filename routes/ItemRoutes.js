const express = require("express");
const stockControllers = require("../controllers/stockControllers");
const authControllers = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .get(stockControllers.getAllItem)
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    stockControllers.createItem
  );
router.route("/getByDate").get(stockControllers.getItemByDate);

router
  .route("/:id")
  .get(stockControllers.getoneItem)
  .patch(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    stockControllers.updateItem
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    stockControllers.deleteItem
  );

module.exports = router;
