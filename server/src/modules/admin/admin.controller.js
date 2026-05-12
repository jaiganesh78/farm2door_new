import * as adminService from "./admin.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getAllUsers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const data = await adminService.getAllOrders();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getDeliveries = async (req, res, next) => {
  try {
    const data = await adminService.getAllDeliveries();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
