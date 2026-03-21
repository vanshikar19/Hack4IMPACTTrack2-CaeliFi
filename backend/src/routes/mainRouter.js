const { Router } = require("express");
const dashboardRouter = require("./DashboardRouter");

const mainRouter = Router();

mainRouter.use("/dashboard", dashboardRouter);

module.exports = mainRouter;