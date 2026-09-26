import sharp from "sharp";

const [inputPath, outputPath, widthArg = "3840", heightArg = "1280", bandArg = "192"] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error("Usage: node scripts/process-panorama.mjs <input> <output> [width] [height] [seam-band]");
}

const width = Number(widthArg);
const height = Number(heightArg);
const seamBand = Number(bandArg);

if (!Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(seamBand)) {
  throw new Error("Width, height and seam band must be integers.");
}

const { data, info } = await sharp(inputPath)
  .resize(width, height, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .sharpen({ sigma: 1, m1: 0.8, m2: 1.5, x1: 2, y2: 10, y3: 20 })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

if (info.channels !== 3 || seamBand < 2 || seamBand * 2 >= info.width) {
  throw new Error("Unexpected image channels or seam-band size.");
}

const original = Buffer.from(data);

for (let y = 0; y < info.height; y += 1) {
  for (let distance = 0; distance < seamBand; distance += 1) {
    const blend = 0.25 * (1 + Math.cos((Math.PI * distance) / (seamBand - 1)));
    const leftX = distance;
    const rightX = info.width - 1 - distance;
    const leftOffset = (y * info.width + leftX) * info.channels;
    const rightOffset = (y * info.width + rightX) * info.channels;

    for (let channel = 0; channel < info.channels; channel += 1) {
      const left = original[leftOffset + channel];
      const right = original[rightOffset + channel];
      data[leftOffset + channel] = Math.round(left * (1 - blend) + right * blend);
      data[rightOffset + channel] = Math.round(right * (1 - blend) + left * blend);
    }
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: info.channels },
})
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPath);

const metadata = await sharp(outputPath).metadata();
console.log(JSON.stringify({ outputPath, width: metadata.width, height: metadata.height, seamBand }, null, 2));
