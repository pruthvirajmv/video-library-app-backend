const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
   {
      userName: {
         type: String,
         required: "User name is required",
         unique: true,
      },

      email: {
         type: String,
         required: "email is required",
         unique: true,
         validate: {
            validator: function (value) {
               return /^([^@]+)([@]{1})([a-z]+)\.com$/.test(value);
            },
            message: (props) => `${props.value} is not email!`,
         },
      },

      password: {
         type: String,
         required: "password is required",
      },

      accountStatus: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

const User = mongoose.model("User", UserSchema);

module.exports = {
   User,
};
