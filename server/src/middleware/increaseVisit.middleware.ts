import Post from "@models/post.model";
import { TCustomRequestHandler } from "../types/request.dto.types";

// Common crawler, scraper, and bot User-Agent signatures
const BOT_REGEX =
  /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|lighthouse|meta-externalagent/i;

// Cache to prevent duplicate visit counting: 1 view per IP per post per 30 minutes
const recentVisits = new Map<string, number>();
const VISIT_COOLDOWN_MS = 30 * 60 * 1000;

// Periodic cleanup to prevent memory leaks (runs every 10 min, unref to avoid blocking process exit)
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentVisits.entries()) {
    if (now - timestamp > VISIT_COOLDOWN_MS) {
      recentVisits.delete(key);
    }
  }
}, 10 * 60 * 1000).unref();

export const increaseVisit: TCustomRequestHandler<{ slug: string }> = async (
  req,
  res,
  next
) => {
  const { slug } = req.params;

  if (!slug) return next();

  const userAgent = req.headers["user-agent"] || "";
  const isPrefetch =
    req.headers["purpose"] === "prefetch" ||
    req.headers["sec-purpose"] === "prefetch";

  // Skip incrementing for automated bots, crawlers, and browser prefetch events
  if (isPrefetch || BOT_REGEX.test(userAgent)) {
    return next();
  }

  // Deduplicate rapid repeat views / focus refetches from the same IP
  const clientIp = req.ip || req.socket.remoteAddress || "unknown";
  const visitKey = `${clientIp}:${slug}`;
  const now = Date.now();
  const lastVisit = recentVisits.get(visitKey);

  if (!lastVisit || now - lastVisit > VISIT_COOLDOWN_MS) {
    recentVisits.set(visitKey, now);
    await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });
  }

  next();
};
