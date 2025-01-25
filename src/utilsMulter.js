import multer from "multer";
import __dirname from "./utils.js";
import { products } from "./routes/productRouter.js";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/images");
  },
});
export const uploader = multer({ storage });
export default uploader;
