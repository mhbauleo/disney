const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const { name } = req.body;
    const ext = path.extname(file.originalname);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

module.exports = upload;
