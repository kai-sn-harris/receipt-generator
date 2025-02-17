const express = require("express");
const router = express.Router();
const ReceiptController = require("./controllers/receipt");
const UserController = require("./controllers/user");
const Middleware = require("./middleware");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get("/status", (req, res) => {
    res.json({ status: "working" });
});

router.post("/create-receipt", async (req, res) => {
    let newReceiptID = await ReceiptController.createReceipt(req.body);
    if(!newReceiptID) res.json({ status: "A validation error occurred, ensure that all required fields are included when creating the receipt. Refer to documentation to check this." });
    else res.json({ status: "Successfully created new receipt", id: newReceiptID });
});

router.get("/get-receipt/:templateName/:id", Middleware.templateAuth, async (req, res) => {
    let id = req.params.id;
    // if receipt exists already then just send the file otherwise generate it first
    if(!ReceiptController.receiptExists(id)) await ReceiptController.generateReceiptByID(id);
    res.sendFile(__dirname + `/receipts/receipt-${id}.pdf`);
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        let uid = await UserController.createUser(email, password);
        res.status(201).json({ status: "Successfully registered new user", uid });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserController.getOneUser({ email });

        if(!user) return res.status(404).json({ message: `User with email: '${email}' not found` });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) res.status(400).json({ message: "Invalid Credentials" });
        else {
            const token = jwt.sign(
                {
                    userId: user._id,
                    isPaidUser: user.isPaidUser
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            res.json({ token })
        }
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;