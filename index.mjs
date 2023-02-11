import fs from "fs";
import { pipeline } from "stream";
import util from "util";
import os from "os";
import path from "path";

const DIRNAME = path.dirname(new URL(import.meta.url).pathname);

const RELEASES_LIST_API_URL =
  "https://api.github.com/repos/vyperlang/vyper/releases?per_page=200";
const LIST_FILENAME = "list.json";
const TMP_DIR = os.tmpdir();

console.log("Downloading releases list");
const respose = await fetch(RELEASES_LIST_API_URL);

if (!respose.ok) {
  console.error("Response not ok");
  process.exit(1);
}

const rawList = await respose.json();
const list = rawList.map(({ assets, tag_name }) => ({
  tag_name,
  assets: assets.map(({ name, browser_download_url }) => ({
    name,
    browser_download_url,
  })),
}));

await fs.writeFileSync(
  path.join(DIRNAME, "public", LIST_FILENAME),
  JSON.stringify(list, undefined, 2),
  "utf-8"
);

const urls = list
  .map((release) => release.assets.map((asset) => asset.browser_download_url))
  .flat();

console.log("Downloading compilers");
await Promise.all(
  urls.map(async (url) => {
    const filename = path.basename(url);
    await download(url, path.join(DIRNAME, "public", filename));
    console.log(filename, "downloaded");
  })
);

export async function download(url, filePath) {
  const streamPipeline = util.promisify(pipeline);

  const response = await fetch(url);

  if (response.ok) {
    const tmpFilePath = path.join(TMP_DIR, path.basename(filePath));

    await streamPipeline(response.body, fs.createWriteStream(tmpFilePath));
    fs.copyFileSync(tmpFilePath, filePath);
    return;
  }

  await response.text();

  throw new Error(`Failed to download ${url}`);
}
