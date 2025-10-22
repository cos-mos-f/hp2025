/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined;

export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix,
  trailingSlash: true
};
