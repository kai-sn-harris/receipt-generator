const User = require("../models/user");
const bcrypt = require("bcryptjs");

// in this project, any errors that occur in a controller are to be handled where the controller is used
// so all errors that could occur in any controller are to be handled by the caller in a try catch block
module.exports = {
    createUser: async (email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });

        await user.save();
        return user._id;
    },
    // key is mongoose key and value to find by eg: { email: "kaiharris@email.provider" }
    getOneUser: async key => {
        // the no user found error, however, is expected behaviour in the case that an unkown user attribute is provided
        let user = await User.findOne(key);
        if(!user) {
            console.error("No user found");
            return null;
        }
        return user;
    }
}