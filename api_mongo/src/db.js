const mongoose = require("mongoose");

module.exports = {
  connect: (DB_HOST) => {
    mongoose.connect(DB_HOST);
    mongoose.connection.on("error", (err) => {
      console.log(err);
      console.log(
        "MOngoDB connetcion error. Please make shure MongoDB running"
      );
      process.exit();
    });
  },
  close: () => {
    mongoose.connection.close();
  },
};
