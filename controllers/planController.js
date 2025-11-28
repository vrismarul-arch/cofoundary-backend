import Plan from "../models/planModel.js";
import Service from "../models/serviceModel.js";

// Get Plans based on Service
export const getPlans = async (req, res) => {
  try {
    const { serviceId } = req.query;

    // If service filter is present → filter else return all
    const filter = serviceId ? { serviceId } : {};

    const plans = await Plan.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const createPlan = async (req, res) => {
  try {
    const service = await Service.findById(req.body.serviceId);
    if (!service) {
      return res.status(400).json({ success: false, message: "Service Not Found" });
    }

    const plan = await Plan.create({
      ...req.body,
      serviceName: service.title,
    });

    res.status(201).json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.serviceId) {
      const service = await Service.findById(payload.serviceId);
      if (service) payload.serviceName = service.title;
    }

    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    res.json({ success: true, updatedPlan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Plan Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
