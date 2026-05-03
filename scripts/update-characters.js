const fs = require("fs");
const fetch = require("node-fetch");

const family = require("../characters.json");

async function fetchCharacter(name) {
  try {
    const res = await fetch(`https://dreamms.gg/index.php?stats=${name}`);
    const text = await res.text();

    // Extract job
    const jobMatch = text.match(/Job<\/td>\s*<td>(.*?)<\/td>/);
    const job = jobMatch ? jobMatch[1] : "Unknown";

    // Extract level
    const levelMatch = text.match(/Level<\/td>\s*<td>(.*?)<\/td>/);
    const level = levelMatch ? levelMatch[1] : "Unknown";

    // Extract image
    const imgMatch = text.match(/<img src="(https:\/\/api\.dreamms\.gg[^"]+)"/);
    const image = imgMatch ? imgMatch[1].replace(/&amp;/g, "&") : "";

    return { job, level, image };
  } catch (e) {
    console.log("Error fetching:", name);
    return { job: "Error", level: "-", image: "" };
  }
}

async function main() {
  const names = Object.keys(family);
  const result = {};

  for (const name of names) {
    console.log("Fetching:", name);
    result[name] = await fetchCharacter(name);
  }

  fs.writeFileSync(
    "characters.json",
    JSON.stringify(result, null, 2)
  );
}

main();
