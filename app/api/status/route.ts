import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import packageJson from "@/package.json";

interface ServiceStatus {
  status: "operational" | "degraded" | "down";
  latency?: number;
  message?: string;
}

interface StatusResponse {
  database: ServiceStatus;
  blobStorage: ServiceStatus;
  auth: ServiceStatus;
  version: string;
  timestamp: string;
  cached: boolean;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedStatus: StatusResponse | null = null;
let lastChecked: number = 0;

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      return {
        status: "down",
        message: "DATABASE_URL not configured",
      };
    }
    const sql = neon(DATABASE_URL);
    await sql`SELECT 1`;
    return {
      status: "operational",
      latency: Date.now() - start,
    };
  } catch (error) {
    console.error("Database check failed:", error);
    return {
      status: "down",
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

async function checkBlobStorage(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    if (!hasToken) {
      return {
        status: "degraded",
        message: "Token not configured",
      };
    }

    return {
      status: "operational",
      latency: Date.now() - start,
      message: "Config present (no deep check)",
    };
  } catch (error) {
    console.error("Blob storage check failed:", error);
    const message = error instanceof Error ? error.message : "Check failed";
    const isConfigError = message.includes("BLOB_READ_WRITE_TOKEN");
    return {
      status: isConfigError ? "degraded" : "down",
      message: isConfigError ? "Token not configured" : message,
    };
  }
}

async function checkAuth(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await auth();
    return {
      status: "operational",
      latency: Date.now() - start,
    };
  } catch (error) {
    console.error("Auth check failed:", error);
    return {
      status: "down",
      message: error instanceof Error ? error.message : "Auth check failed",
    };
  }
}

async function fetchFreshStatus(): Promise<StatusResponse> {
  const [database, blobStorage, authStatus] = await Promise.all([
    checkDatabase(),
    checkBlobStorage(),
    checkAuth(),
  ]);

  return {
    database,
    blobStorage,
    auth: authStatus,
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    cached: false,
  };
}

export async function GET() {
  try {
    const now = Date.now();
    const cacheAge = now - lastChecked;

    if (cachedStatus && cacheAge < CACHE_TTL_MS) {
      return NextResponse.json({
        ...cachedStatus,
        cached: true,
        cacheAge: Math.round(cacheAge / 1000),
      });
    }

    const freshStatus = await fetchFreshStatus();
    cachedStatus = freshStatus;
    lastChecked = now;

    return NextResponse.json(freshStatus);
  } catch (error) {
    console.error("Status check error:", error);

    if (cachedStatus) {
      return NextResponse.json({
        ...cachedStatus,
        cached: true,
        stale: true,
      });
    }

    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 },
    );
  }
}
