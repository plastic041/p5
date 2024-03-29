import { runMinesweeper } from "./pages/minesweeper";
import { runWfc } from "./pages/wfc";
import { runDither } from "./pages/dither";

const urls = ["wfc", "minesweeper", "dither"];

const main = () => {
  const header = document.querySelector("header")!;
  const links = urls.map(
    (url) => `
      <a href="./${url}">
        ${url}
      </a>
    `
  ).join(`
    `);
  header.innerHTML = links;

  const pathname = window.location.pathname.split("/")[1];
  console.log(pathname);

  switch (pathname) {
    case "wfc":
      runWfc();
      break;

    case "minesweeper":
      runMinesweeper();
      break;

    case "dither":
      runDither();
      break;

    default:
      break;
  }
};

main();
