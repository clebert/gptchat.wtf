/** @type {import('aws-simple').ConfigFileDefaultExport} */
export default () => ({
  hostedZoneName: `gptchat.wtf`,
  terminationProtectionEnabled: true,
  routes: [
    {
      type: `file`,
      publicPath: `/*`,
      path: `dist/index.html`,
      responseHeaders: { 'cache-control': `no-store` },
    },
    {
      type: `file`,
      publicPath: `/apple-touch-icon.png`,
      path: `apple-touch-icon.png`,
      responseHeaders: { 'cache-control': `max-age=86400` }, // 24 hours
    },
    {
      type: `folder`,
      publicPath: `/static/*`,
      path: `dist`,
      responseHeaders: { 'cache-control': `max-age=157680000` }, // 5 years
    },
  ],
});
