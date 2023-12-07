import stripe from "stripe";
import { errorResponse, successResponse } from "../utils/responses.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeSecretKey);

export const makePayment = async (req, res) => {
  try {
    const { surveyName, amount } = req.body;
    const product = await stripeInstance.products.create({
      name: `Survey: ${surveyName}`,
      description: `Payment for ${surveyName}`,
    });
    const price = await stripeInstance.prices.create({
      product: product.id,
      unit_amount: amount * 100,
      currency: "inr",
    });
    const session = await stripeInstance.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: "https://ezmony.in/success",
      cancel_url: "https://ezmony.in/cancel",
    });
    successResponse(res, 200, "Payment initiated successfully", {
      sessionId: session.url,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
