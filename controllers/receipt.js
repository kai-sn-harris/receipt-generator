const Receipt = require("../models/receipt");
const tradePDF = require("@zed378/invoice-pdfkit");
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
        tradePDF.init({
            logo: fs.existsSync("logo.jpg") ? fs.readFileSync("logo.jpg") : undefined,
            company: {
                company: receipt.businessName,
                email: receipt.bussinessEmail,
                web: receipt.businessWebsite
            },
            currency: "AUD",
        });
        let invoiceItems = [];
        receipt.items.forEach(item => {
            invoiceItems.push({
                id: item._id.toString(),
                desc: item.description,
                tax: "0",
                qty: "0",
                price: item.unitPrice.toString()
            });
        });
        const pdfData = tradePDF.invoice({
            id: receipt._id,
            date: {
                created: receipt.createdAt.toDateString(),
                due: receipt.dueDate.toDateString()
            },
            bill: {
                company: receipt.customerName,
                email: receipt.customerEmail
            },
            items: invoiceItems,
            total: {
                discount: 0,
                stateTax: 0,
                fedTax: receipt.tax,
                ship: 20
            }
        });
        fs.writeFileSync(`./receipts/receipt-${id}.pdf`, pdfData);
        console.log("Generated simple.pdf");
    },
    receiptExists: id => {
        return fs.existsSync(`./receipts/receipt-${id}.pdf`);
    }
}