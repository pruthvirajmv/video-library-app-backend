var jwt = require("jsonwebtokens");
const { User } = require("../models/user.model");
const JWT_KEY = process.env.JWT_KEY;

const authentication = async (req, res, next) => {
   try {
      const tokenWithBearer = req.headers.authorization;
      const token = tokenWithBearer.split(" ")[1];
      const decoded = jwt.verify(token, JWT_KEY);
      const userId = decoded.userId;
      const user = await User.findById(userId);
      if (!userId) {
         return res.status(401).send({ success: false, message: "authenticatoin failed" });
      }
      req.user = user;
      next();
   } catch (err) {
      res.status(500).send({
         success: false,
         message: "something went wrong",
         errorMessage: err.message,
      });
   }
};

module.exports = { authentication };
