const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Links to User model
  billingCompany: { type: String, required: true },
  billingName: { type: String, required: true }, 
  billingEmail: { type: String, required: true }, 
  billingAddress: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  dateDue: { type: Date, default: Date.now },
  company: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: true },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true }
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }, 
  paymentMethod: { type: String, required: true }, 
  // paymentStatus: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Paid" }, // Payment status
  // notes: { type: String }, // Additional notes or comments
});

// Middleware to auto-update `updatedAt`
ReceiptSchema.pre("save", function (next) {
  this.dateCreated = Date.now();
  next();
});

module.exports = mongoose.model("Receipt", ReceiptSchema);
