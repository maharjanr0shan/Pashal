const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  addToWishlist,
  rating,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin, createProduct);

router.get("/:id", getSingleProduct);

router.put("/wishlist", authMiddleware, addToWishlist);

router.put("/rating", authMiddleware, rating);

router.get("/", getAllProduct);

router.put("/:id", authMiddleware, isAdmin, updateProduct);

router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;
