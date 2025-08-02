const redis = require("redis");

class RedisAdapter {
  constructor(options = {}) {
    this.client = redis.createClient({
      socket: {
        host: options.host || process.env.REDIS_HOST || "localhost",
        port: options.port || process.env.REDIS_PORT || 6379,
      },
    });
    this.client
      .connect()
      .then(() => {
        console.log("RedisAdapter: Connected to Redis server");
      })
      .catch((err) => {
        console.error("RedisAdapter: Redis connection error:", err);
      });
  }

  async set(key, value, ttl = 3600) {
    try {
      await this.client.set(key, JSON.stringify(value), { EX: ttl });
      console.log(
        `RedisAdapter: Set key '${key}' with TTL ${ttl}. Value:`,
        value
      );
    } catch (err) {
      console.error(`RedisAdapter: Error setting key '${key}':`, err);
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      console.log(`RedisAdapter: Get key '${key}'`);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`RedisAdapter: Error getting key '${key}':`, err);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      console.log(`RedisAdapter: Deleted key '${key}'`);
    } catch (err) {
      console.error(`RedisAdapter: Error deleting key '${key}':`, err);
    }
  }

  async exists(key) {
    try {
      const result = await this.client.exists(key);
      console.log(
        `RedisAdapter: Exists check for key '${key}' => ${result === 1}`
      );
      return result === 1;
    } catch (err) {
      console.error(
        `RedisAdapter: Error checking existence of key '${key}':`,
        err
      );
      return false;
    }
  }

  async disconnect() {
    try {
      await this.client.quit();
      console.log("RedisAdapter: Disconnected from Redis server");
    } catch (err) {
      console.error(
        "RedisAdapter: Error disconnecting from Redis server:",
        err
      );
    }
  }
}

module.exports = RedisAdapter;
