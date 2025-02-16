const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User model
  billingCompany: { type: String, required: true }, // Name of the business issuing the receipt
  billingName: { type: String, required: true }, // Business address
  billingEmail: { type: String, required: true }, // Business email
  billingAddress: { type: String, required: true }, // Business Website
  dateCreated: { type: Date, default: Date.now }, // Timestamp for when the receipt was created
  dateDue: { type: Date, default: Date.now }, // Timestamp for last update
  company: { type: String, required: true }, // Customer name
  email: { type: String, required: true }, // Customer name
  website: { type: String, required: true }, // Customer name
  items: [
    {
      description: { type: String, required: true }, // Item description
      quantity: { type: Number, required: true, min: 1 }, // Quantity purchased
      unitPrice: { type: Number, required: true }, // Price per unit
      totalPrice: { type: Number, required: true } // Total cost for the item
    }
  ],
  subtotal: { type: Number, required: true }, // Total before tax
  tax: { type: Number, default: 0 }, // Tax amount (GST, VAT, etc.)
  totalAmount: { type: Number, required: true }, // Final total amount after tax
  paymentMethod: { type: String, required: true }, // Payment type
  // paymentStatus: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Paid" }, // Payment status
  // notes: { type: String }, // Additional notes or comments
});

// Middleware to auto-update `updatedAt`
ReceiptSchema.pre("save", function (next) {
  this.dateCreated = Date.now();
  next();
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
