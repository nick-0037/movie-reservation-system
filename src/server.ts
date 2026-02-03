import express from "express";
import apiRoutes from "./routes/index";
import { handleStripeHook } from "./controllers/webhook.controller";

const app = express();

app.post(
	"/api/webhooks/stripe",
	express.raw({ type: "application/json" }),
	handleStripeHook,
);

app.use(express.json());

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
