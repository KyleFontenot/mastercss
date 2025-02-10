import type { BuildOptions } from "bun"

const modules = [
  'core',
  'runtime',
  'extractor',
  'validator',
]

try {
  for (const module of modules) {
    const build = await Bun.build({
      entrypoints: [`./src/${module}/src/index.ts`],
      outdir: `./dist/${module}`,
      target: 'node'
    } satisfies BuildOptions)
    console.log(build)
  }
}
catch (e) {
  console.error(e)
}