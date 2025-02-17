const jwt = require("jsonwebtoken");

module.exports = {
    auth: (req, res, next) => {
        const token = req.header("Authorization");

        if(!token) return res.status(401).json({ message: "Access Denied" });

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            if(!verified.isPaidUser) return res.status(403).json({ message: "Paid subscription required" });
            
            req.user = verified;
            next();
        } catch(e) {
            res.status(401).json({ message: "Invalid Token" });
        }
    },
    templateAuth: (req, res, next) => {
        let template = req.params.templateName;
        if(!template) return res.status(204).json({ message: `There is no '${template}' template` });
        else {
            req.template = template;
            if(template !== "default") module.exports.auth(req, res, next);
            else next();
        }
    }
}