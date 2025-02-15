import homepage from "./page.html";
//import masterglobal from "../src/core/global.css";

console.log(await Bun.$`pwd`.text())

const server = Bun.serve({
  static: {
    "/": homepage,
    //"/master.js": new Response(await Bun.file("dist/core/src/index.js").text(), {
    //  headers: {
    //    "Content-Type": "application/javascript",
    //  }
    //}),
  },

  development: true,
  port: 5173,

  // Handle API requests
  async fetch(req: Request) {

    //console.log("hello?", req.url)
    if (req.url.endsWith("/master.js")) {
      //console.log("endswith::::  testing.js")
      return new Response(await Bun.file("dist/runtime/src/index.js").text(), {
        headers: {
          "Content-Type": "application/javascript",
        }
      });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);