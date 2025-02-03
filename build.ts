

try {
  Bun.build({
    entrypoints: ["./src/core"],
    outdir: "./dist"
  })
console.log('built: ', )
}
catch (e) {
  console.error(e)
}