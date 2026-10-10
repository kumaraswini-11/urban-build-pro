// One-off re-encode of oversized source images (P1): PNGs saved as .jpg are
// converted to real, right-sized JPEGs. Run: bun scripts/optimize-images.mjs
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const jobs = [
  { file: "public/assets/images/hero/bg.jpg", width: 2560 },
  { file: "public/assets/images/work/construction.jpg", width: 1024 },
  { file: "public/assets/images/work/consulting.jpg", width: 1024 },
  { file: "public/assets/images/work/renovation.jpg", width: 1024 },
  { file: "public/assets/images/work/restoration.jpg", width: 1024 },
];

for (const { file, width } of jobs) {
  const input = await readFile(file);
  const output = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await writeFile(file, output);
  console.log(
    `${file}: ${(input.length / 1024).toFixed(0)} KB -> ${(output.length / 1024).toFixed(0)} KB`,
  );
}
