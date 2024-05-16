/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
           {
            hostname: "marvelous-echidna-758.convex.cloud",
           }
        ]
    }
};

export default nextConfig;
