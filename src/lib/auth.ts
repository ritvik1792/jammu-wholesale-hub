import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "bbg_admin_session";

// Default credentials if environment variables are not set
export const DEFAULT_ADMIN_USERNAME = "gsamay";
// SHA-256 hash of "Samay.G@2001"
export const DEFAULT_ADMIN_PASSWORD_HASH =
  "0aa77169e07ea8b7d4a94f68c997e262e614d76385e55e7d7fd23c2e8e1ef44d";

export function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    "d724225d50d64c5ce18a231699530f08d5d686bc9e94072ca24aabe7edb19523"
  );
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!username || !password) return false;

  const expectedUsername = (
    process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME
  ).trim();

  if (username.trim() !== expectedUsername) {
    return false;
  }

  // Support both hashed password in env (recommended) and plaintext fallback
  let expectedHash = (process.env.ADMIN_PASSWORD_HASH || "").trim().toLowerCase();
  if (!expectedHash && process.env.ADMIN_PASSWORD) {
    expectedHash = hashPassword(process.env.ADMIN_PASSWORD.trim());
  }
  if (!expectedHash) {
    expectedHash = DEFAULT_ADMIN_PASSWORD_HASH;
  }

  const inputHash = hashPassword(password);

  try {
    const a = Buffer.from(inputHash, "utf-8");
    const b = Buffer.from(expectedHash, "utf-8");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function createSessionToken(username: string): string {
  const secret = getSessionSecret();
  const payload = {
    user: username,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const secret = getSessionSecret();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expSigBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    );
    if (!payload.exp || payload.exp < Date.now()) {
      return false;
    }
    const expectedUsername = (
      process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME
    ).trim();
    if (payload.user !== expectedUsername) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}
