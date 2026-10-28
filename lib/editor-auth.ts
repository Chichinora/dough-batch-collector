import { env } from "cloudflare:workers";

const encoder = new TextEncoder();
const toBase64Url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const sign = async (value: string) => {
  const key = await crypto.subtle.importKey("raw", encoder.encode(env.SESSION_SECRET || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
};
const cookieValue = (request: Request, name: string) => request.headers.get("cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1);
export async function isEditor(request: Request) {
  if (!env.SESSION_SECRET) return false;
  const token = cookieValue(request, "editor_session"); if (!token) return false;
  const [expiry, signature] = token.split("."); if (!expiry || !signature || Number(expiry) < Date.now()) return false;
  return signature === await sign(expiry);
}
export async function credentialsValid(username: string, password: string) { return username === (env.EDITOR_USERNAME || "SBL2026") && Boolean(env.EDITOR_PASSWORD) && password === env.EDITOR_PASSWORD; }
export async function sessionCookie() { const expiry = String(Date.now() + 1000 * 60 * 60 * 12); return `editor_session=${expiry}.${await sign(expiry)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`; }
