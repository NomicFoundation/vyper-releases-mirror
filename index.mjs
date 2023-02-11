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

const list = await respose.json();

await fs.writeFileSync(
  path.join(DIRNAME, "public", LIST_FILENAME),
  JSON.stringify(list[0], undefined, 2),
  "utf-8"
);

for (const release of list) {
  for (const asset of release.assets) {
    const filename = path.basename(asset.browser_download_url);
    console.log("Downloading", filename);

    await download(
      asset.browser_download_url,
      path.join(DIRNAME, "public", filename)
    );
  }
}

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
