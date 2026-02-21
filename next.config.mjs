/** @type {import('next').NextConfig} */
const spacesPublicBaseUrl = process.env.SPACES_PUBLIC_BASE_URL;
const spacesHostname = spacesPublicBaseUrl ? new URL(spacesPublicBaseUrl).hostname : null;

const remotePatterns = [
  {
    hostname: "utfs.io",
    protocol: "https",
    port: "",
    pathname: "/**",
  },
  {
    hostname: "utfs.io",
    protocol: "http",
    port: "",
    pathname: "/**",
  },
  {
    hostname: "*.ufs.sh",
    protocol: "https",
    port: "",
    pathname: "/**",
  },
  {
    hostname: "*.digitaloceanspaces.com",
    protocol: "https",
    port: "",
    pathname: "/**",
  },
  {
    hostname: "*.cdn.digitaloceanspaces.com",
    protocol: "https",
    port: "",
    pathname: "/**",
  },
];

if (spacesHostname) {
  remotePatterns.unshift({
    hostname: spacesHostname,
    protocol: "https",
    port: "",
    pathname: "/**",
  });
}

const config = {
  images: {
    remotePatterns,
  },
};

export default config;
