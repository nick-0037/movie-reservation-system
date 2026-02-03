import { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "../db/index";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleStripeHook = async (req: Request, res: Response) => {
	const sig = req.headers["stripe-signature"] as string;
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (e: any) {
		console.error(e);
		return res.status(400).send(`Webhook error: ${e.message}`);
	}

	const paymentIntent = event.data.object as Stripe.PaymentIntent;
	const reservationId = paymentIntent.metadata.reservationId;

	switch (event.type) {
		case "payment_intent.succeeded":
			await db
				.update(schema.reservations)
				.set({ status: "confirmed" })
				.where(eq(schema.reservations.id, Number(reservationId)));
			break;
		case "payment_intent.payment_failed":
			await db
				.update(schema.reservations)
				.set({ status: "cancelled" })
				.where(eq(schema.reservations.id, Number(reservationId)));
			break;
	}

	res.status(200).json({ received: true });
};
