import stripe from "stripe";
import moment from "moment";
import { errorResponse, successResponse } from "../utils/responses.js";
import {
  surveyAttrs,
  adAttrs,
  reelAttrs,
  ytVideoAttrs,
  dayRangeMultipliers,
} from "../utils/constants.js";
import { missingFieldsErrorMsg } from "../utils/helperfunctions.js";

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
      success_url: "https://ezmony.in/payment/success",
      cancel_url: "https://ezmony.in/payment/cancel",
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
    const { noOfResponses, noOfQuestions } = req.body;
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);
    if (!startDate || !endDate || !noOfQuestions) {
      return errorResponse(
        res,
        400,
        missingFieldsErrorMsg({
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          noOfQuestions,
        })
      );
    }
    if (!noOfResponses || !noOfResponses === 0) {
      return successResponse(res, 200, "Payment calculated successfully", {
        payout: 0,
      });
    }
    const totalDays = moment.duration(endDate.diff(startDate)).asDays();
    const basePayment = surveyAttrs.costPerResponse * noOfResponses;
    const questionPayment = surveyAttrs.costPerQuestion * noOfQuestions;
    let multiplier = 0;
    for (const range in dayRangeMultipliers) {
      if (totalDays <= parseInt(range, 10)) {
        multiplier = dayRangeMultipliers[range];
        break;
      }
    }
    let payment = basePayment + questionPayment;
    payment += payment * multiplier;
    successResponse(res, 200, "Payment calculated successfully", {
      payout: Math.round(payment),
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const calculatePaymentForAds = async (req, res) => {
  try {
    const { noOfViewers, targetPersonalizedAudience } = req.body;
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);
    if (!req.body.startDate || !req.body.endDate) {
      return errorResponse(
        res,
        400,
        missingFieldsErrorMsg({
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        })
      );
    }
    if ( !noOfViewers ||  noOfViewers === 0) {
      return successResponse(res, 200, "Payment calculated successfully", {
        payout: 0,
      });
    }
    const totalDays = moment.duration(endDate.diff(startDate)).asDays();
    const basePayment = adAttrs.costPerView * noOfViewers;
    let payout = basePayment;
    if (targetPersonalizedAudience === true) {
      payout += (basePayment * 0.5)
    }
    let multiplier = 0
    for (const range in dayRangeMultipliers) {
      if (totalDays <= parseInt(range, 10)) {
        multiplier = dayRangeMultipliers[range];
        break;
      }
    }
    payout += (payout * multiplier);
    successResponse(res, 200, "Payment calculated successfully", {
      payout: Math.round(payout),
    })
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const calculatePaymentForReels = async (req, res) => {
  try {
    const { noOfViews, targetPersonalizedAudience } = req.body;
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);
    if (!req.body.startDate || !req.body.endDate) {
      return errorResponse(
        res,
        400,
        missingFieldsErrorMsg({
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        })
      );
    }
    if (!noOfViews || !noOfViews === 0) {
      return successResponse(res, 200, "Payment calculated successfully", {
        payout: 0,
      });
    }
    const totalDays = moment.duration(endDate.diff(startDate)).asDays();
    const basePayment = reelAttrs.costPerView * noOfViews;
    let payout = basePayment;
    if (targetPersonalizedAudience === true) {
      payout += (basePayment * 0.5)
    }
    let multiplier = 0
    for (const range in dayRangeMultipliers) {
      if (totalDays <= parseInt(range, 10)) {
        multiplier = dayRangeMultipliers[range];
        break;
      }
    }
    payout += (payout * multiplier);
    successResponse(res, 200, "Payment calculated successfully", {
      payout: Math.round(payout),
    })
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
}

export const calculatePaymentForVideos = async (req, res) => {
  try {
    const { noOfViews, targetPersonalizedAudience } = req.body;
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);
    if (!req.body.startDate || !req.body.endDate) {
      return errorResponse(
        res,
        400,
        missingFieldsErrorMsg({
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        })
      );
    }
    if (!noOfViews || !noOfViews === 0) {
      return successResponse(res, 200, "Payment calculated successfully", {
        payout: 0,
      });
    }
    const totalDays = moment.duration(endDate.diff(startDate)).asDays();
    const basePayment = ytVideoAttrs.costPerView * noOfViews;
    let payout = basePayment;
    if (targetPersonalizedAudience === true) {
      payout += (basePayment * 0.5)
    }
    let multiplier = 0
    for (const range in dayRangeMultipliers) {
      if (totalDays <= parseInt(range, 10)) {
        multiplier = dayRangeMultipliers[range];
        break;
      }
    }
    payout += (payout * multiplier);
    successResponse(res, 200, "Payment calculated successfully", {
      payout: Math.round(payout),
    })
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
}