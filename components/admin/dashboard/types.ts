export interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down';
  latency?: number;
  message?: string;
}

export interface StatusData {
  database: ServiceStatus;
  blobStorage: ServiceStatus;
  auth: ServiceStatus;
  version: string;
  timestamp: string;
  cached?: boolean;
}
