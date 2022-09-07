import { runFlocking } from "./pages/flocking";
import { runParticles } from "./pages/particles";

const urls = ["flocking", "particles"];

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
    case "particles":
      runParticles();
      break;

    case "flocking":
      runFlocking();
      break;

    default:
      break;
  }
};

main();
