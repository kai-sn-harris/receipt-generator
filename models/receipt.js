const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User model
  receiptNumber: { type: String, required: true, unique: true }, // Unique identifier for the receipt
  businessName: { type: String, required: true }, // Name of the business issuing the receipt
  businessAddress: { type: String, required: true }, // Business address
  businessEmail: { type: String, required: true }, // Business email
  businessWebsite: { type: String, required: true }, // Business Website
  businessABN: { type: String }, // Optional business tax ID (ABN for Australia)
  customerName: { type: String, required: true }, // Customer name
  customerEmail: { type: String }, // Optional customer email
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
  paymentStatus: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Paid" }, // Payment status
  issueDate: { type: Date, default: Date.now }, // Date receipt was issued
  dueDate: { type: Date }, // Optional due date for unpaid invoices
  notes: { type: String }, // Additional notes or comments
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the receipt was created
  updatedAt: { type: Date, default: Date.now } // Timestamp for last update
});

// Middleware to auto-update `updatedAt`
ReceiptSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
