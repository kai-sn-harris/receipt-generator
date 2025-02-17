const PDFDocument = require("pdfkit");
const fs = require("fs");

const formatDate = date => {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

module.exports = data => {
    return new Promise((resolve, reject) => {
        const {
            id,
            billingCompany,
            billingName,
            billingEmail,
            billingAddress,
            dateCreated,
            dateDue,
            company,
            email,
            website,
            items,
            subtotal,
            tax,
            totalAmount,
        } = data;
        // Create a new PDF document
        const doc = new PDFDocument({ size: "A4", margin: 50 });

        // Output file
        const outputFilePath = `./receipts/receipt-${id}.pdf`;
        const stream = fs.createWriteStream(outputFilePath);
        doc.pipe(stream);

        // --- HEADER ---
        doc.font("Helvetica-Bold").fontSize(24).text("INVOICE", { align: "right" });
        doc.moveTo(50, 80).lineTo(550, 80).stroke(); // Horizontal Line

        // --- ISSUED TO ---
        doc.fontSize(10).font("Helvetica-Bold").text("ISSUED TO:", 50, 100);
        doc.font("Helvetica").text(billingName, 50, 115);
        doc.text(billingCompany, 50, 130);
        doc.text(billingEmail, 50, 145);
        doc.text(billingAddress, 50, 160);

        // --- INVOICE DETAILS ---
        doc.font("Helvetica-Bold").text("INVOICE ID:", 345, 100);
        doc.font("Helvetica").text(id, 495-81, 100);
        doc.font("Helvetica-Bold").text("DATE:", 345, 115);
        doc.font("Helvetica").text(formatDate(dateCreated), 445, 115, { align: "right" });
        doc.font("Helvetica-Bold").text("DUE DATE:", 345, 130);
        doc.font("Helvetica").text(formatDate(dateDue), 445, 130, { align: "right" });

        // --- PAY TO ---
        doc.font("Helvetica-Bold").text("PAY TO:", 50, 185);
        doc.font("Helvetica").text(company, 50, 200);
        doc.text(email, 50, 215);
        doc.text(website, 50, 230);

        // --- TABLE HEADERS ---
        doc.moveTo(50, 250).lineTo(550, 250).stroke(); // Line above table

        doc.font("Helvetica-Bold").text("DESCRIPTION", 50, 260);
        doc.text("UNIT PRICE", 300, 260, { width: 90, align: "right" });
        doc.text("QTY", 400, 260, { width: 60, align: "right" });
        doc.text("TOTAL", 480, 260, { width: 60, align: "right" });

        doc.moveTo(50, 275).lineTo(550, 275).stroke(); // Line under headers
        
        let y = 290;
        items.forEach((item) => {
            doc.font("Helvetica").text(item.description, 50, y);
            doc.text(`$${item.unitPrice}`, 300, y, { width: 90, align: "right" });
            doc.text(item.quantity, 400, y, { width: 60, align: "right" });
            doc.text(`$${item.unitPrice * item.quantity}`, 480, y, { width: 60, align: "right" });
            y += 20;
        });

        doc.moveTo(50, y).lineTo(550, y).stroke(); // Line under items

        // --- TOTALS ---
        y += 10;
        doc.font("Helvetica-Bold").text("SUBTOTAL", 400, y);
        doc.text(`$${subtotal}`, 500, y, { align: "right" });

        y += 15;
        doc.text("Tax", 400, y);
        doc.text(`${tax}%`, 500, y, { align: "right" });

        y += 15;
        doc.text("TOTAL", 400, y);
        doc.text(`$${totalAmount}`, 500, y, { align: "right" });

        // add watermark
        doc.font("Helvetica-Bold")
            .fontSize(100) // Large font size
            .fillColor("gray") // Light gray watermark
            .fillOpacity(0.2) // Make it transparent
            .rotate(-45, { origin: [300, 400] }) // Rotate diagonally
            .text("Default Invoice", 100, 300, { align: "center" })
            .fillOpacity(1) // Reset opacity for normal text
            .rotate(45, { origin: [300, 400] }); // Reset rotation


        // Finalize the PDF
        doc.end();

        console.log(`Invoice generated: ${outputFilePath}`);
        stream.on("finish", () => resolve(outputFilePath));
        stream.on("error", err => reject(err));
    });
}