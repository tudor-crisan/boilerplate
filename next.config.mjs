/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false
  },

  async rewrites() {
    // Diagnosing build error - minimal rewrites for loyalboards
    console.log('--- REWRITES START ---');
    console.log('APP:', process.env.NEXT_PUBLIC_APP);

    return [
      { source: '/preview/email', destination: '/modules/preview/email' },
      { source: '/success', destination: '/modules/billing/success' }
    ];
  }
};

export default nextConfig;
