// Gera os arquivos que o site carrega a partir de saints.json (a base completa).
//   data/index.json  campos da lista, dos filtros e da busca (carregado ao abrir o site)
//   data/d/N.json    detalhes de cada ficha, em 16 partes (carregados ao abrir uma ficha)
// As frases de tools/frases.json entram nos detalhes como o campo "q".
// Uso: node tools/build-data.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHARDS = 16;
const INDEX_KEYS = ["id", "n", "h", "k", "g", "b", "x", "f", "t", "c", "la", "alt", "bp", "dp", "o", "ord", "pc", "pk", "sp"];

const saints = JSON.parse(readFileSync(join(root, "saints.json"), "utf8"));
const frases = JSON.parse(readFileSync(join(root, "tools", "frases.json"), "utf8"));

const index = [];
const shards = Array.from({ length: SHARDS }, () => ({}));
const ids = new Set();
for (const s of saints) {
  ids.add(s.id);
  const row = {}, det = {};
  for (const [k, v] of Object.entries(s)) (INDEX_KEYS.includes(k) ? row : det)[k] = v;
  if (frases[s.id]) det.q = frases[s.id];
  index.push(row);
  if (Object.keys(det).length) shards[Number(s.id.slice(1)) % SHARDS][s.id] = det;
}
for (const id of Object.keys(frases)) if (!ids.has(id)) console.warn(`frases.json: ${id} não está em saints.json`);

const line = (o) => JSON.stringify(o);
rmSync(join(root, "data"), { recursive: true, force: true });
mkdirSync(join(root, "data", "d"), { recursive: true });
writeFileSync(join(root, "data", "index.json"), "[\n" + index.map(line).join(",\n") + "\n]\n");
shards.forEach((sh, i) => writeFileSync(join(root, "data", "d", `${i}.json`), line(sh) + "\n"));
console.log(`${index.length} santos, ${Object.keys(frases).length} frases, ${SHARDS} partes de detalhes.`);
