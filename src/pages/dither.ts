import P5 from "p5";
import Color from "colorjs.io";

const IMAGE = "/kirby.jpg";
const NOISE_IMAGE = "/noise.png";

export const runDither = () => {
  let img: P5.Image;
  let noiseImg: P5.Image;
  let noiseArray: number[] = [];
  let pixelIndex = 0;

  let loopEnd = 0;

  const sketch = (p5: P5) => {
    p5.preload = () => {
      img = p5.loadImage(IMAGE);
      noiseImg = p5.loadImage(NOISE_IMAGE);
    };

    p5.setup = () => {
      const canvas = p5.createCanvas(450, 600);
      canvas.parent("p5");

      p5.image(img, 0, 0);

      loopEnd = p5.width * p5.height * p5.pixelDensity() ** 2;

      noiseImg.loadPixels();
      for (let i = 0; i < noiseImg.width * noiseImg.height; i++) {
        const index = i * 4;
        const l = noiseImg.pixels[index + 0] / 255;
        noiseArray.push(l);
      }

      p5.frameRate(30);
    };

    p5.draw = () => {
      p5.loadPixels();

      const step = () => {
        const index = pixelIndex * 4;
        const noiseIndex = pixelIndex % noiseArray.length;

        const r = p5.pixels[index + 0];
        const g = p5.pixels[index + 1];
        const b = p5.pixels[index + 2];
        const a = p5.pixels[index + 3];

        const color = new Color("sRGB", [r / 255, g / 255, b / 255]);
        const luminance = color.lch.l;
        // const luminance = (r + g + b) / 3;

        const threshold = 90 * noiseArray[noiseIndex];

        if (luminance > threshold) {
          p5.pixels[index + 0] = 255;
          p5.pixels[index + 1] = 255;
          p5.pixels[index + 2] = 255;
          p5.pixels[index + 3] = a;
        } else {
          p5.pixels[index + 0] = 0;
          p5.pixels[index + 1] = 0;
          p5.pixels[index + 2] = 0;
          p5.pixels[index + 3] = a;
        }
      };

      for (let i = 0; i < p5.width * 24; i++) {
        step();
        pixelIndex++;
      }

      if (pixelIndex > loopEnd) {
        p5.noLoop();
      }

      p5.updatePixels();
    };
  };

  new P5(sketch);
};
