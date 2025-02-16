const express = require("express");
const router = express.Router();
const ReceiptController = require("./controllers/receipt");

router.get("/status", (req, res) => {
    res.json({ status: "working" });
});

router.post("/create-receipt", async (req, res) => {
    let newReceiptID = await ReceiptController.createReceipt(req.body);
    if(!newReceiptID) res.json({ status: "A validation error occurred, ensure that all required fields are included when creating the receipt. Refer to documentation to check this." });
    else res.json({ status: "Successfully created new receipt", id: newReceiptID });
});

router.get("/get-receipt/:id", async (req, res) => {
    let id = req.params.id;
    // if receipt exists already then just send the file otherwise generate it first
    if(ReceiptController.receiptExists(id))
        res.sendFile(__dirname + `/receipts/receipt-${id}.pdf`);
    else {
        await ReceiptController.generateReceiptByID(id);
        res.sendFile(__dirname + `/receipts/receipt-${id}.pdf`);
    }
});

module.exports = router;