import type { BuildOptions } from "bun"
import colors from "yoctocolors"

const modules = [
  'core',
  'runtime',
  'extractor',
  'validator',
  'server',
]

type BuildPackageName = 'core' | 'extractor' | 'runtime' | 'validator' | 'server';

const buildPackage = async (packagename: BuildPackageName) =>
  Bun.build({
    entrypoints: [
      `./src/${packagename}/src/index.ts`,
    ],
    outdir: `./dist/`,
    format: 'esm',
    target: 'bun',
    splitting: true,
    file: `./dist/${packagename}.js`,
    packages: 'external',
    naming: {
      entry: `${packagename}.[ext]`,
      chunk: '[name]-[hash].[ext]',
      asset: '[name]-[hash].[ext]',
    },
  } satisfies BuildOptions)
    .then(res => res)


//Bun.build({
//  entrypoints: [
//    `./src/core/src/index.ts`,
//  ],
//  outdir: `./dist/`,
//  format: 'esm',
//  target: 'bun',
//  external: ['./common.ts', './common'],
//  splitting: true,
//  file: `./dist/core.js`,
//} satisfies BuildOptions)

const bench1 = performance.now();

console.log('inspect: ', modules)

//Promise.allSettled(
//  modules.map(
//    mod => new Promise(
//      (resolve, reject) => {
//        buildPackage(mod).then(d => {
//          console.log('inspect: ', d.outputs[0].path)
//          //resolve(d)
//          return d
//        })
//          .catch(err => {
//            console.warn(colors.red(`Failed to build ${mod}:: ${err}`))
//            reject(err)
//          })
//      }
//    )
//  )
//)
//  .then((results: unknown[]): void => {
//    console.log('after: ', results)
//    const bench2 = performance.now();
//    console.log('build took: ', `${bench2 - bench1}ms`);
//  })
//  console.log('inspect: ')

// mjs build
const going = await Bun.build({
  entrypoints: [
    `./src/core/src/index.ts`,
    `./src/extractor/src/index.ts`,
    `./src/runtime/src/index.ts`,
    `./src/validator/src/index.ts`,
  ],
  outdir: `./dist/`,
  format: 'esm',
  target: 'bun',
  packages: 'external',
  splitting: true,
  naming: {
    entry: '[dir].[ext]',
    chunk: '[name]-[hash].[ext]',
    asset: '[name]-[hash].[ext]',
  },
})
console.log('biuling: ', going)

//await Bun.build({
//    entrypoints: [
//      `./src/core/src/index.ts`,
//      `./src/extractor/src/index.ts`,
//      `./src/runtime/src/index.ts`,
//      `./src/validator/src/index.ts`,
//    ],
//    outdir: `./dist/`,
//    format: 'esm',
//    target: 'bun',
//    splitting: true,
//    naming: {
//      // default values
//      entry: '[dir]/[name].[ext]',
//      chunk: '[name]-[hash].[ext]',
//      asset: '[name]-[hash].[ext]',
//    },
//  })


// cjs build. ?
//await Bun.build({
//  entrypoints: [
//    `./src/core/src/index.ts`,
//    `./src/extractor/src/index.ts`,
//    `./src/runtime/src/index.ts`,
//    `./src/validator/src/index.ts`,
//  ],
//  outdir: `./dist/`,
//  format: 'cjs',
//  target: 'node',
//  splitting: true,
//} satisfies BuildOptions)