declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    EDITOR_USERNAME?: string;
    EDITOR_PASSWORD?: string;
    SESSION_SECRET?: string;
  }
}
