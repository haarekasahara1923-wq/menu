import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.swadanusar.app',
  appName: 'Menu App',
  webDir: 'public',
  server: {
    url: 'https://menu-gamma-three.vercel.app',
    cleartext: true
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
