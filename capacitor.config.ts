import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.promptpilot.app',
  appName: 'PromptPilot',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
