const express = require('express');
const app = express();
const initializer = require('./config/initApp');
const EnvironmentManager = require('./config/envService');
const User = require('./Database/Entities/users')
const ProfileHashTag = require('./Database/Entities/profileHashTags');
const PORT = 3000;







app.get("/", (req, res) => {
    const testSecret = EnvironmentManager.getSecret("TEST");
    res.json({ TEST: testSecret });
});

async function testMM() {
    const testSuperMM = await User.findOne({
        where: {
            realName: "Jane6"
        },
        include: ProfileHashTag
    });
    console.log("selects", testSuperMM.toJSON());
};

initializer.initApp().then(() => {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
    testMM()
});