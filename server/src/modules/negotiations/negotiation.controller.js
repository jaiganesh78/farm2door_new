import * as service from "./negotiation.service.js";

export const createOffer = async (req, res) => {
  try {
    const result = await service.createOffer(req.user, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getNegotiation = async (req, res) => {
  try {
    const result = await service.getNegotiation(req.user, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyNegotiations = async (req, res) => {
  try {
    const result = await service.getMyNegotiations(req.user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const respond = async (req, res) => {
  try {
    const result = await service.respondToOffer(
      req.user,
      req.params.id,
      req.body
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};