/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'res.cloudinary.com', 
            'img.clerk.com',
            'randomuser.me'
        ]
    },
    // Add these optimizations
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true
};

export default nextConfig;