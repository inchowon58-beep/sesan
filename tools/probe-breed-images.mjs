const folders = [
  "Newwhiteterrier","bishone","bosten","bunyz","chauchau","chihuahua","coca","coldenret","coton","daks","dalma","doberman","doodle","engbuldog","frenchi","italian","malamute","maltese","maltipoo","minipin","oldbig","pekinee","pome","pomsky","rabriter","samoyed","selti","shichu","shuna","siba","toypoodle","welshi","yoki","abisinan","american","bnagal","british","maincoon","mcnchikin","neva","norwe","perisian","ragdoll","rusian","scottish","singa","spinkix",
];

async function countFolder(folder) {
  let n = 0;
  for (let i = 1; i <= 80; i++) {
    const url = `https://image.cattery.co.kr/${folder}/${String(i).padStart(2, "0")}.webp`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) break;
      n = i;
    } catch {
      break;
    }
  }
  return [folder, n];
}

const results = {};
const chunk = 6;
for (let i = 0; i < folders.length; i += chunk) {
  const part = folders.slice(i, i + chunk);
  const pairs = await Promise.all(part.map(countFolder));
  for (const [f, n] of pairs) {
    results[f] = n;
    console.log(f, n);
  }
}
import fs from "fs";
fs.writeFileSync("tools/breed-image-counts.json", JSON.stringify(results, null, 2));
console.log("done", results);
