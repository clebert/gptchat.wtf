/** @type {import('aws-simple').ConfigFileDefaultExport} */
export default () => ({
  hostedZoneName: `gptchat.wtf`,
  monitoring: {accessLoggingEnabled: true},
  terminationProtectionEnabled: true,
  routes: [
    {
      type: `file`,
      publicPath: `/*`,
      path: `dist/index.html`,
      responseHeaders: {'cache-control': `no-store`},
    },
    {
      type: `folder`,
      publicPath: `/static/*`,
      path: `dist`,
      responseHeaders: {'cache-control': `max-age=157680000`}, // 5 years
    },
  ],
});
