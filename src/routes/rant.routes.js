const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createRant,
  getRantById,
  getRants,
  getRantWithComments,
  deleteRant,
  likeRant,
  unlikeRant,
} = require("../controllers/rant.controller");

router.get("/", getRants);
router.get("/:id", getRantById);
router.get("/with-comments/:id", getRantWithComments);
router.post("/", auth, createRant);
router.delete("/:id", auth, deleteRant);
router.post("/:id/like", auth, likeRant);
router.post("/:id/unlike", auth, unlikeRant);

module.exports = router;
