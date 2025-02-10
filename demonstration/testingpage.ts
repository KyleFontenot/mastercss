import homepage from "./page.html";
//import masterglobal from "../src/core/global.css";

const server = Bun.serve({
  // Add HTML imports to `static`
  static: {
    // Bundle & route index.html to "/"
    "/": homepage,
    //"/style": masterglobal,
    // Bundle & route dashboard.html to "/dashboard"
    //"/dashboard": dashboard,
  },

  // Enable development mode for:
  // - Detailed error messages
  // - Rebuild on request
  development: true,

  // Handle API requests
  async fetch(req: Request) {
    // ...your API code
    if (req.url.endsWith("/api/users")) {
      //const users = await Bun.sql`SELECT * FROM users`;
      return new Response();
    }

    // Return 404 for unmatched routes
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);