import * as service from "./payment.service.js";
import logger from "../../utils/logger.js";

export const createOrder = async (req, res, next) => {
  try {
    const result = await service.createRazorpayOrder(
      req.user,
      req.params.orderId
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const verify = async (req, res, next) => {
  try {
    const result = await service.verifyPayment(req.user, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req, res) => {
  try {
    await service.handleRazorpayWebhook(
      req.body,
      req.get("x-razorpay-signature")
    );

    res.status(200).send("OK");
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      context: "razorpay_webhook",
    });

    // Still return 200 to avoid infinite retries for logic errors
    res.status(200).send("OK");
  }
};
