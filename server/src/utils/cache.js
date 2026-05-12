import redis from "../config/redis.js";

const LISTINGS_PREFIX = "listings:";

export const getCache = async (key) => {
  if (!redis) return null;
  try {
    const raw = await redis.get(key);
    if (raw == null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds) => {
  if (!redis) return;
  try {
    const payload = JSON.stringify(value);
    await redis.setex(key, ttlSeconds, payload);
  } catch {
    /* fail silent — caller uses DB */
  }
};

export const deleteCache = async (key) => {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {
    /* fail silent */
  }
};

export const deleteCacheByPattern = async (pattern) => {
  if (!redis) return;
  try {
    let cursor = "0";
    do {
      const [next, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );
      cursor = next;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch {
    /* fail silent */
  }
};

export const invalidateListingCaches = async (listingId) => {
  await deleteCache(`listing:${listingId}`);
  await deleteCacheByPattern(`${LISTINGS_PREFIX}*`);
};
