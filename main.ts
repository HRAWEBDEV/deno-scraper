import * as path from "@std/path";
import * as cheerio from "cheerio";
const indexPath = path.join(Deno.cwd(), "/public/index.html");
const indexCssPath = path.join(Deno.cwd(), "/public/index.css");
//
async function scrapeCheerioNpm(): Promise<unknown> {
  try {
    const result = await fetch("https://www.npmjs.com/package/cheerio", {
      "method": "GET",
      "headers": {
        "content-type": "html/txt",
      },
    });
    const content = await result.text();
    const $ = cheerio.load(content);
    // here we can traverse the dom and find tags and tags content
    console.log($);
  } catch (err) {
    return err;
  }
}

Deno.serve({
  port: 8080,
}, async (req) => {
  const url = new URL(req.url);
  if (req.method === "GET" && url.pathname === "/") {
    const indexFile = await Deno.readTextFile(indexPath);
    return new Response(indexFile, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  }
  if (req.method === "GET" && url.pathname === "/public/index.css") {
    const indexFile = await Deno.readTextFile(indexCssPath);
    return new Response(indexFile, {
      status: 200,
      headers: {
        "content-type": "text/css",
      },
    });
  }
  if (req.method === "GET" && url.pathname === "/get-info") {
    scrapeCheerioNpm();
    return Response.json({ message: "get message" }, {
      status: 200,
    });
  }

  return new Response("not found", {
    status: 404,
  });
});
