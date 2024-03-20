const express = require('express');
const app = express();
const EnvironmentManager = require('./utils/envEnitity'); // 调整路径以匹配你的项目结构






app.get("/", (req, res) => {
    const testSecret = EnvironmentManager.getSecret("TEST");
    res.json({ TEST: testSecret });
});

EnvironmentManager.loadSecrets().then(() => {
    console.log('Environment variables are loaded and ready to use.');

    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});