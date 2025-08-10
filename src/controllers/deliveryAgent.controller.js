import User from "../models/user.model.js";
import {Delivery} from "../models/delivery.model.js";

export const listDeliveryAgentsWithOrders = async (req, res) => {
  try {
    // Find all delivery agents
    const agents = await User.find({ role: "delivery_agent" })
      .select("name email phone") // limit fields
      .lean();

    // Fetch deliveries grouped by agent
    const deliveries = await Delivery.find()
      .populate("order", "status totalAmount deliveryAddress")
      .lean();

    // Attach deliveries to agents
    const agentsWithOrders = agents.map(agent => ({
      ...agent,
      deliveries: deliveries.filter(d => d.deliveryAgent?.toString() === agent._id.toString())
    }));

    return res.success(200, "Delivery agents with orders fetched", agentsWithOrders);
  } catch (err) {
    console.error(err);
    return res.error(500, "Server error", err.message);
  }
};


export const getDeliveryAgentWithOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await User.findOne({ _id: id, role: "delivery_agent" })
      .select("name email phone")
      .lean();
    if (!agent) return res.error(404, "Delivery agent not found");

    const deliveries = await Delivery.find({ deliveryAgent: id })
      .populate("order", "status totalAmount deliveryAddress")
      .lean();

    return res.success(200, "Delivery agent with orders fetched", {
      ...agent,
      deliveries
    });
  } catch (err) {
    console.error(err);
    return res.error(500, "Server error", err.message);
  }
};