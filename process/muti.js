const axios = require('axios');
for (let i = 0; i < 25; i++) {
    setImmediate(async () => {
        try {
            const url = 'https://ym-be-common-v2-dev.baobaohehu.com/test_error?cur=' + i;
            console.log(i);
            await axios.default.get(url)
        } catch (error) {

        }
    })
}