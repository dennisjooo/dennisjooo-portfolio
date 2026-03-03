import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const d = new Date();
const year = d.getFullYear();
const month = String(d.getMonth() + 1).padStart(2, "0");
const day = String(d.getDate()).padStart(2, "0");
const dateVersion = `${year}.${month}.${day}`;

if (pkg.version === dateVersion) {
  pkg.version = `${dateVersion}-b`;
} else if (pkg.version.startsWith(`${dateVersion}-`)) {
  const suffix = pkg.version.split("-")[1];
  const next = String.fromCharCode(suffix.charCodeAt(0) + 1);
  pkg.version = `${dateVersion}-${next}`;
} else {
  pkg.version = dateVersion;
}

writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
console.log(`Version: ${pkg.version}`);
