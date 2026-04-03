import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./modules/auth/auth.routes.js";
import ApiError from "./common/utils/api-error.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

// Catch-all for undefined routes
app.all("{*path}", (req, res) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});


app.use((err, req, res, next) => {
  console.error(err); // log error

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
export default app;