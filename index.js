const express = require("express");
const cors = require("cors");
const watch = require("./watch");
const app = express();
require("dotenv").config();

app.use(cors());

app.use("/app", express.static(__dirname + "/ui/dist"));

let count = "0";

app.get("/", (_, res) => {
  res.json({
    "health-checked": `${count} times`,
  });
});

const background = function () {
  console.log("🩺 mongo-event-sourcing health check");
  setTimeout(background, 60000);
  count++;
};

const port = process.env.PORT || 5000;
const connection = process.env.MONGODB_URL;

try {
  //Start the server
  app.listen(port, () => {
    console.log(
      `🚀 MESS (Mongo Event Sourcing) listening at http://localhost:${port}`
    );
  });
  //Start watcher
  watch(connection);
  //Start health check
  background();
} catch (error) {
  console.log(error);
  process.exit(1);
}