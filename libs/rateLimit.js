import { defaultSetting as settings } from "@/libs/defaults";
import connectMongo from "@/libs/mongoose";
import { responseError } from "@/libs/utils.server";
import RateLimit from "@/models/RateLimit";

/**
 * Check rate limit for an IP and route.
 * @param {string} ip - User IP address
 * @param {string} route - Identifier for the action/route (e.g. "auth-quick-link")
 * @param {number} limit - Max requests allowed in the window (default 5)
 * @param {number} windowSeconds - Time window in seconds (default 60)
 * @returns {Promise<{ allowed: boolean, message?: string }>}
 */
export async function checkRateLimit(ip, route, limit = 5, windowSeconds = 60) {
  try {
    await connectMongo();

    // Find the rate limit record
    let record = await RateLimit.findOne({ ip, route });
    const now = new Date();

    if (!record) {
      // Create new record
      await RateLimit.create({
        ip,
        route,
        requests: 1,
        firstRequest: now,
        lastRequest: now
      });
      return { allowed: true };
    }

    const windowStart = new Date(record.firstRequest);
    const windowEnd = new Date(windowStart.getTime() + windowSeconds * 1000);

    if (now > windowEnd) {
      // Window expired, reset
      record.requests = 1;
      record.firstRequest = now;
      record.lastRequest = now;
      await record.save();
      return { allowed: true };
    } else {
      // Window active
      if (record.requests >= limit) {
        const remainingSeconds = Math.ceil((windowEnd.getTime() - now.getTime()) / 1000);
        return {
          allowed: false,
          message: `Too many requests. Please try again in ${remainingSeconds} seconds.`
        };
      }

      // Increment
      record.requests += 1;
      record.lastRequest = now;
      await record.save();
      return { allowed: true };
    }

  } catch (error) {
    console.error("Rate limit check error:", error);
    // Fail open (allow) if DB error to avoid outage
    return { allowed: true };
  }
}

/**
 * Check rate limit for a Next.js request object.
 * Returns null if allowed, or a response object if blocked.
 * @param {Request} req - Next.js request object
 * @param {string} type - Rate limit type key in settings (e.g. "post-create")
 * @returns {Promise<Response|null>}
 */
export async function checkReqRateLimit(req, type) {
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
  const config = settings.rateLimits?.[type] || { limit: 10, window: 60 };

  const { allowed, message } = await checkRateLimit(ip, type, config.limit, config.window);

  if (!allowed) {
    return responseError(message, {}, 429);
  }

  return null;
}
