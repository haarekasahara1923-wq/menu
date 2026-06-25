import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.menu.app',
  appName: 'Menu App',
  webDir: 'public',
  server: {
    url: 'https://menu-gamma-three.vercel.app',
    cleartext: true
  }
};

export default config;
