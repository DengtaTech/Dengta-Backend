const express = require('express');
const app = express();
const initializer = require('./config/initApp');
const EnvironmentManager = require('./config/envService');
const PORT = 3000;







app.get("/", (req, res) => {
    const testSecret = EnvironmentManager.getSecret("TEST");
    res.json({ TEST: testSecret });
});


initializer.initApp().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});