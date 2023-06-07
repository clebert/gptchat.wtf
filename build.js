import autoprefixer from 'autoprefixer';
import * as esbuild from 'esbuild';
import {htmlPlugin} from 'esbuild-html-plugin';
import stylePlugin from 'esbuild-style-plugin';
import {rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {argv, env} from 'node:process';

const require = createRequire(import.meta.url);
const outdir = `dist`;
const dev = env.NODE_ENV === `development`;

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [
    {
      out: `app`,
      in: `src/components/app.tsx`,
    },
    {
      out: `editor.worker`,
      in: require.resolve(`monaco-editor/esm/vs/editor/editor.worker`),
    },
    ...[`css`, `html`, `json`, `ts`].map((language) => ({
      out: `${language}.worker`,
      in: require.resolve(
        `monaco-editor/esm/vs/language/${
          language === `ts` ? `typescript` : language
        }/${language}.worker`,
      ),
    })),
  ],
  entryNames: `[dir]/[name]-[hash]`,
  bundle: true,
  minify: !dev,
  sourcemap: dev,
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV ?? `production`),
    '__DEV__': String(dev),
  },
  metafile: true,
  target: `es2022`,
  tsconfig: `tsconfig.base.json`,
  outdir,
  publicPath: `/static`,
  loader: {
    '.ttf': `file`,
  },
  plugins: [
    stylePlugin({
      postcss: {
        // eslint-disable-next-line import/no-commonjs
        plugins: [require(`tailwindcss`), autoprefixer],
      },
    }),
    htmlPlugin({
      outfile: `index.html`,
      language: `en`,

      createHeadElements: (outputUrls) => [
        `<meta charset="utf-8" />`,
        `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
        `<title>gptchat.wtf</title>`,

        ...outputUrls
          .filter((url) => url.endsWith(`.css`))
          .map((url) => `<link href="${url}" rel="stylesheet">`),
      ],

      createBodyElements: (outputUrls) => [
        `<main id="app"></main>`,

        `<script src="${outputUrls.find(
          (url) => url.includes(`app`) && url.endsWith(`.js`),
        )}" async></script>`,

        `<script>(${[`editor`, `css`, `html`, `json`, `ts`].reduce(
          (template, workerType) =>
            template.replace(
              `<${workerType}>`,
              /** @type {string} */ (
                outputUrls.find(
                  (url) =>
                    url.includes(`${workerType}.worker`) && url.endsWith(`.js`),
                )
              ),
            ),
          setupMonacoEnvironment.toString(),
        )})();</script>`,
      ],
    }),
  ],
};

if (argv.includes(`--watch`)) {
  const ctx = await esbuild.context(options);

  await ctx.watch();
} else {
  await rm(outdir, {recursive: true, force: true});

  await esbuild.build(options);
}

function setupMonacoEnvironment() {
  self.MonacoEnvironment = {
    getWorkerUrl(_moduleId, label) {
      switch (label) {
        case `css`:
          return `<css>`;
        case `html`:
          return `<html>`;
        case `json`:
          return `<json>`;
        case `typescript`:
        case `javascript`:
          return `<ts>`;
      }

      return `<editor>`;
    },
    createTrustedTypesPolicy() {
      return undefined;
    },
  };
}
