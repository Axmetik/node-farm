const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

// FILES
// Blocking, sync way
// const avocado = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(avocado);
// const textOutput =
//   "This is a string to write down to the file";
// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("Success!");

// Non-blocking, async way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(
//     `./txt/${data1}.txt`,
//     "utf-8",
//     (err, data2) => {
//       console.log(data2);
//       fs.readFile(
//         "./txt/append.txt",
//         "utf-8",
//         (err, data3) => {
//           console.log(data3);
//           fs.writeFile(
//             "./txt/final.txt",
//             `${data2}/${data3}`,
//             "utf-8",
//             (err) => {
//               console.error(err);
//             }
//           );
//         }
//       );
//     }
//   );
// });
// console.log("Read file...");

// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }

  // product page
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }

  // api page
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  // not found page
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Something went wrong</h1>");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("Server started on 5000 port");
});
