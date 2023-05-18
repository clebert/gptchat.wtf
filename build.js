import autoprefixer from 'autoprefixer';
import * as esbuild from 'esbuild';
import stylePlugin from 'esbuild-style-plugin';
import {minify} from 'html-minifier';
import {readFile, rm, writeFile} from 'node:fs/promises';
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
    {
      name: `html`,
      setup: (build) =>
        build.onEnd(async (result) => {
          const html = await readFile(`src/index.html`, {encoding: `utf-8`});

          const outputNames = result.metafile
            ? Object.keys(result.metafile.outputs)
            : [];

          await writeFile(
            `${outdir}/index.html`,
            minify(
              html
                .replace(
                  `<!-- STYLES -->`,
                  `<link href="${getPublicPath(
                    `app`,
                    `css`,
                    outputNames,
                  )}" rel="stylesheet">`,
                )

                .replace(
                  `<!-- SCRIPTS -->`,
                  `<script>(${setupMonacoEnvironment
                    .toString()
                    .replace(
                      `<editor.worker>`,
                      getPublicPath(`editor.worker`, `js`, outputNames),
                    )
                    .replace(
                      `<css.worker>`,
                      getPublicPath(`css.worker`, `js`, outputNames),
                    )
                    .replace(
                      `<html.worker>`,
                      getPublicPath(`html.worker`, `js`, outputNames),
                    )
                    .replace(
                      `<json.worker>`,
                      getPublicPath(`json.worker`, `js`, outputNames),
                    )
                    .replace(
                      `<ts.worker>`,
                      getPublicPath(`ts.worker`, `js`, outputNames),
                    )})();</script>\n    <script src="${getPublicPath(
                    `app`,
                    `js`,
                    outputNames,
                  )}" async></script>`,
                ),
              {collapseWhitespace: true, minifyCSS: true, minifyJS: true},
            ),
            {encoding: `utf-8`},
          );
        }),
    },
  ],
};

if (argv.includes(`--watch`)) {
  const ctx = await esbuild.context(options);

  await ctx.watch();
} else {
  await rm(outdir, {recursive: true, force: true});

  await esbuild.build(options);
}

/** @type {(entryName: string, entryType: 'css' |'js', outputNames: readonly string[]) => string} */
function getPublicPath(entryName, entryType, outputNames) {
  const outputName = outputNames.find(
    (name) =>
      name.startsWith(`${outdir}/${entryName}-`) &&
      name.endsWith(`.${entryType}`),
  );

  if (!outputName) {
    throw new Error(`Unknown entry name: "${entryName}"`);
  }

  // TODO: use publicPath
  return outputName.replace(outdir, `/static`);
}

function setupMonacoEnvironment() {
  self.MonacoEnvironment = {
    getWorkerUrl(_moduleId, label) {
      switch (label) {
        case `css`:
          return `<css.worker>`;
        case `html`:
          return `<html.worker>`;
        case `json`:
          return `<json.worker>`;
        case `typescript`:
        case `javascript`:
          return `<ts.worker>`;
      }

      return `<editor.worker>`;
    },
  };
}
