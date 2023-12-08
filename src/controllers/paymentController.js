import stripe from "stripe";
import { errorResponse, successResponse } from "../utils/responses.js";
import { dayRangeMultipliers } from "../utils/constants.js";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeSecretKey);

export const makePayment = async (req, res) => {
  try {
    const { type, name, amount } = req.body;
    const product = await stripeInstance.products.create({
      name: `${type}: ${name}`,
      description: `Payment of your ${type}: "${name}" for promotion!`,
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

export const calculatePaymentForSurveys = async (req, res) => {
  try {
    const { startDate, endDate, noOfResponses, noOfQuestions } = req.body;
    const totalDays = Math.round(( endDate - startDate ) / (1000 * 60 * 60 * 24));
    const basePayment = 5 * noOfResponses;
    const questionPayment = 100 * noOfQuestions;
    let multiplier = 0;
    for (const range in dayRangeMultipliers) {
      if (totalDays <= parseInt(range, 10)) {
        multiplier = dayRangeMultipliers[range];
        break;
      }
    }
    const payment = basePayment + (multiplier * basePayment);
    successResponse(res, 200, "Payment calculated successfully", {
      payout: payment + questionPayment
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};