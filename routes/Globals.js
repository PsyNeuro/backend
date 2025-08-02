// constants.js

/* Globals*/
global.CookieTTL = 3600000;
global.RedisTTL = 3600;
/*End of Globals*/
module.exports = { CookieTTL, RedisTTL };

// In other files
const { RedisMaxAge } = require("./Globals");
