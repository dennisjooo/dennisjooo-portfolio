import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { auth } from '@clerk/nextjs/server';
import packageJson from '@/package.json';

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down';
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

// Server-side cache
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cachedStatus: StatusResponse | null = null;
let lastChecked: number = 0;

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      return {
        status: 'down',
        message: 'DATABASE_URL not configured',
      };
    }
    const sql = neon(DATABASE_URL);
    // Simple ping query
    await sql`SELECT 1`;
    return {
      status: 'operational',
      latency: Date.now() - start,
    };
  } catch (error) {
    console.error('Database check failed:', error);
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

async function checkBlobStorage(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    if (!hasToken) {
      return {
        status: 'degraded',
        message: 'Token not configured',
      };
    }

    return {
      status: 'operational',
      latency: Date.now() - start,
      message: 'Config present (no deep check)',
    };
  } catch (error) {
    console.error('Blob storage check failed:', error);
    // Check if it's a configuration issue vs actual downtime
    const message = error instanceof Error ? error.message : 'Check failed';
    const isConfigError = message.includes('BLOB_READ_WRITE_TOKEN');
    return {
      status: isConfigError ? 'degraded' : 'down',
      message: isConfigError ? 'Token not configured' : message,
    };
  }
}

async function checkAuth(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    // Verify Clerk is working by calling auth()
    await auth();
    return {
      status: 'operational',
      latency: Date.now() - start,
    };
  } catch (error) {
    console.error('Auth check failed:', error);
    return {
      status: 'down',
      message: error instanceof Error ? error.message : 'Auth check failed',
    };
  }
}

async function fetchFreshStatus(): Promise<StatusResponse> {
  // Run all checks in parallel for speed
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

    // Return cached response if still fresh
    if (cachedStatus && cacheAge < CACHE_TTL_MS) {
      return NextResponse.json({
        ...cachedStatus,
        cached: true,
        cacheAge: Math.round(cacheAge / 1000), // seconds since last check
      });
    }

    // Fetch fresh status and update cache
    const freshStatus = await fetchFreshStatus();
    cachedStatus = freshStatus;
    lastChecked = now;

    return NextResponse.json(freshStatus);
  } catch (error) {
    console.error('Status check error:', error);

    // If we have stale cache, return it rather than erroring
    if (cachedStatus) {
      return NextResponse.json({
        ...cachedStatus,
        cached: true,
        stale: true,
      });
    }

    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
