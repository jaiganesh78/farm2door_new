import * as disputeService from "./dispute.service.js";

export const raiseDispute = async (req, res, next) => {
  try {
    const data = await disputeService.raiseDispute(
      req.params.orderId,
      req.user,
      req.body.reason
    );
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getDisputeByOrder = async (req, res, next) => {
  try {
    const data = await disputeService.getDisputeByOrderId(
      req.params.orderId,
      req.user
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const resolveDispute = async (req, res, next) => {
  try {
    const data = await disputeService.resolveDispute(
      req.params.id,
      req.body.resolution,
      req.body.action
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
