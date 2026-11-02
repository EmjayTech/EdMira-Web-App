import next from 'eslint-config-next';

const config = [
  ...next,
  // Same rule as the mobile app's React Native config.
  { rules: { 'no-bitwise': 'error' } },
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
];

export default config;
