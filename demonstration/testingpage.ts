import path, { dirname, join } from "node:path";
import homepage from "./page.html" with {type: "text"};
//import masterglobal from "../src/core/global.css";
//import { fileURLToPath } from "node:url";

//import cssServer from "../dist/server"
import customConfig from "./mastercss.ts"
import MasterCss from "../dist/core"

const masterCss = new MasterCss(customConfig)

console.log('inspect: ', masterCss)

//const __dirname = dirname(import.meta.url);
//var relativePath = path.relative(process.cwd(), someFilePath);
//const router = new Bun.FileSystemRouter({
//  style: "nextjs",
//  dir: join(dirname(fileURLToPath(import.meta.url)), './src/routes'),
//  origin: "https://mydomain.com",
//  assetPrefix: path.relative(import.meta.url, './src/static'),
//})

const server = Bun.serve({
  //static: {
  //  //"/home": homepage,
  //},
  //routes : {
  //
  //},

  development: true,
  port: 5173,

  // Handle API requests
  async fetch(req: Request) {
    if (req.url.endsWith("/")) {

      return new Response(homepage, {
        headers: {
          "Content-Type": "text/html",
        }
      })
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);