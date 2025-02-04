import type { BuildOptions } from "bun"

try {
  const built = await Bun.build({
    entrypoints: ["./src/core"],
    outdir: "./dist"
  } satisfies BuildOptions)
  for (let log of built.logs) {
    console.log(log)
  }

  console.log('inspect::', built)
}
catch (e) {
  console.error(e)
}