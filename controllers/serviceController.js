import Service from "../models/serviceModel.js";

// Create Service
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get All Services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Service (Missing 👑)
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) return res.status(404).json({ success: false, message: "Not Found" });

    res.json({
      success: true,
      message: "Service Updated",
      service,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Not Found" });

    res.json({ success: true, message: "Deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
