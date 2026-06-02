import fs from "node:fs/promises";
import path from "node:path";

const base = "https://geo.datav.aliyun.com/areas_v3/bound";
const dataDir = path.resolve("data");
const provinceDir = path.join(dataDir, "provinces");

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: "",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

const china = await fetchJson(`${base}/100000_full.json`);
await writeJson(path.join(dataDir, "china-provinces.json"), china);

const provinces = china.features
  .map((feature) => feature.properties)
  .filter((props) => props && props.adcode && props.name);

for (const province of provinces) {
  const code = String(province.adcode);
  try {
    const geo = await fetchJson(`${base}/${code}_full.json`);
    await writeJson(path.join(provinceDir, `${code}.json`), geo);
    console.log(`saved ${code} ${province.name}`);
  } catch (error) {
    console.warn(`skip ${code} ${province.name}: ${error.message}`);
  }
}
