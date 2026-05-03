const fs = require("fs");

const names = [
  "Thocky","Kaiko","Gillian","Miffyy","Gill","looted","54o88",
  "Mellowdy","Tock","Gwailou","Rushyy","ggill","Hell","ggil",
  "Tocki","8lo8lo8lowme","Exteriority","sunshines","Tocky",
  "Leaw","mabokdy","scrabbit","Tork","okdy","sunbaedy",
  "Chageee","Arun","Afersie","wookimo","Tokk","Seub","TypeR"
];

async function fetchCharacter(name) {
  try {
    const url = `https://dreamms.gg/index.php?stats=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    const html = await res.text();

    const text = html.replace(/\s+/g, " ");

    const jobMatch = text.match(/Job<\/[^>]+>\s*<[^>]+>(.*?)<\/[^>]+>/i);
    const levelMatch = text.match(/Level<\/[^>]+>\s*<[^>]+>(.*?)<\/[^>]+>/i);
    const imgMatch = html.match(/<img[^>]+src="(https:\/\/api\.dreamms\.gg\/api\/gms\/latest\/character\/[^"]+)"/i);

    return {
      job: jobMatch ? clean(jobMatch[1]) : "",
      level: levelMatch ? clean(levelMatch[1]) : "",
      image: imgMatch ? imgMatch[1].replaceAll("&amp;", "&") : ""
    };
  } catch (err) {
    console.log(`Failed: ${name}`, err.message);
    return {
      job: "",
      level: "",
      image: ""
    };
  }
}

function clean(value) {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

async function main() {
  const result = {};

  for (const name of names) {
    console.log("Fetching", name);
    result[name] = await fetchCharacter(name);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  fs.writeFileSync("characters.json", JSON.stringify(result, null, 2));
  console.log("characters.json updated");
}

main();
