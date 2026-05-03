const fs = require("fs");
const https = require("https");

const names = [
  "Thocky","Kaiko","Gillian","Miffyy","Gill","looted","54o88",
  "Mellowdy","Tock","Gwailou","Rushyy","ggill","Hell","ggil",
  "Tocki","8lo8lo8lowme","Exteriority","sunshines","Leaw",
  "mabokdy","scrabbit","Tork","okdy","sunbaedy","Chageee",
  "Arun","Afersie","wookimo","Tokk","Seub","TypeR"
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function clean(v) {
  return String(v || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchCharacter(name) {
  try {
    const url = `https://dreamms.gg/index.php?stats=${encodeURIComponent(name)}`;
    const html = await fetchPage(url);
    const plain = clean(html);

    const jobMatch =
      plain.match(/Job:\s*([^:]+?)\s+Level:/i) ||
      plain.match(/Job\s*[:\-]\s*([A-Za-z ]+)/i);

    const levelMatch =
      plain.match(/Level:\s*([\d,]+)/i) ||
      plain.match(/Lv\.\s*([\d,]+)/i);

    const imgMatch = html.match(
      /https:\/\/api\.dreamms\.gg\/api\/gms\/latest\/character\/[^"' <]+/i
    );

    return {
      job: jobMatch ? clean(jobMatch[1]) : "",
      level: levelMatch ? clean(levelMatch[1]) : "",
      image: imgMatch ? imgMatch[0].replaceAll("&amp;", "&") : ""
    };
  } catch (err) {
    console.log(`Failed: ${name}`, err.message);
    return { job: "", level: "", image: "" };
  }
}

async function main() {
  const result = {};

  for (const name of names) {
    console.log("Fetching", name);
    result[name] = await fetchCharacter(name);
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync("characters.json", JSON.stringify(result, null, 2));
  console.log("characters.json updated");
}

main();
