import * as reviewService from "./review.service.js";

export const createReview = async (req, res, next) => {
  try {
    const data = await reviewService.createReview(
      req.params.orderId,
      req.user,
      req.body
    );
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getReviewsForUser = async (req, res, next) => {
  try {
    const data = await reviewService.getReviewsForUser(req.params.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
