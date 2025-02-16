const Receipt = require("../models/receipt");
const DefaultTemplateWriter = require("../invoice-templates/default");
const fs = require("fs");

module.exports = {
    // creates a new receipt and returns the id if successfully created
    // otherwise it prints an error to the console and returns nothing
    createReceipt: async data => {
        // check that data provided is valid
        const newReceipt = new Receipt(data);
        let validationErrors = newReceipt.validateSync();
        if(validationErrors) {
            console.log("Validation Errors:", validationErrors.errors);
        }
        else {
            await newReceipt.save();
            return newReceipt._id;
        }
    },
    generateReceiptByID: async id => {
        const receipt = await Receipt.findById(id);
        // returns promise as file io operations are stream based and unaffected by async await
        await DefaultTemplateWriter(receipt)
    },
    receiptExists: id => {
        return fs.existsSync(`./receipts/receipt-${id}.pdf`);
    }
}