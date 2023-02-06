import { runWfc } from "./pages/wfc";

const urls = ["wfc"];

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

    default:
      break;
  }
};

main();
