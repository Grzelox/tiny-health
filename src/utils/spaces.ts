import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "node:path";

export type SpacesConfig = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
};

const requiredEnvVars = [
  "SPACES_ENDPOINT",
  "SPACES_REGION",
  "SPACES_BUCKET",
  "SPACES_ACCESS_KEY_ID",
  "SPACES_SECRET_ACCESS_KEY",
  "SPACES_PUBLIC_BASE_URL",
] as const;

export const getSpacesConfig = (): SpacesConfig => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Spaces configuration: ${missing.join(", ")}`);
  }

  return {
    endpoint: process.env.SPACES_ENDPOINT as string,
    region: process.env.SPACES_REGION as string,
    bucket: process.env.SPACES_BUCKET as string,
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY as string,
    publicBaseUrl: process.env.SPACES_PUBLIC_BASE_URL as string,
  };
};

export const createSpacesClient = () => {
  const config = getSpacesConfig();
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
};

// The Spaces client is stateless and configured purely from env vars, so we can
// safely reuse a single instance instead of constructing a new one for every
// signed-URL request (which happens once per uploaded file on list/detail loads).
let cachedSpacesClient: S3Client | null = null;

const getSpacesClient = (): S3Client => {
  if (!cachedSpacesClient) {
    cachedSpacesClient = createSpacesClient();
  }
  return cachedSpacesClient;
};

export const buildPublicUrl = (key: string, baseUrl?: string) => {
  const resolvedBaseUrl = baseUrl ?? getSpacesConfig().publicBaseUrl;
  return `${resolvedBaseUrl.replace(/\/$/, "")}/${key}`;
};

export const getSignedGetUrl = async (key: string, expiresInSeconds: number = 60 * 60 * 24) => {
  const config = getSpacesConfig();
  const client = getSpacesClient();
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
};

export const sanitizeExtension = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  return /^\.[a-z0-9]+$/.test(ext) ? ext : "";
};
