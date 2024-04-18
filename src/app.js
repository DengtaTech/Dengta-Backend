const express = require('express');
const models = require("./Database/models");
const app = express();
const PORT = 3000;








models.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
