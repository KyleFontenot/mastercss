import type { BuildOptions } from "bun"

const modules = [
  'core',
  'runtime',
  'extractor',
  'validator',
]

try {
    const esmbuild = await Bun.build({
      entrypoints: [
        `./src/core/src/index.ts`,
        `./src/extractor/src/index.ts`,
        `./src/runtime/src/index.ts`,
        `./src/validator/src/index.ts`,
      ],
      outdir: `./dist/`,
      format: 'esm',
      target: 'bun',
      splitting: true,
    } satisfies BuildOptions)

    const cjsbuild = await Bun.build({
      entrypoints: [
        `./src/core/src/index.ts`,
        `./src/extractor/src/index.ts`,
        `./src/runtime/src/index.ts`,
        `./src/validator/src/index.ts`,
      ],
      outdir: `./dist/`,
      format: 'cjs',
      target: 'node',
      splitting: true,
    } satisfies BuildOptions)

  //for (const module of modules) {
  //  const build = await Bun.build({
  //    entrypoints: [`./src/${module}/src/index.ts`],
  //    outdir: `./dist/${module}`,
  //    target: 'node',
  //    splitting: true,
  //  } satisfies BuildOptions)
  //  console.log(build)
  //}
}
catch (e) {
  console.error(e)
}