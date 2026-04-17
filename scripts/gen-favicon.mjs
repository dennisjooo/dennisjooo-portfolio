import { execSync } from 'node:child_process';

const SRC = 'public/images/logo.webp';
const OUT = 'public/favicon.ico';

execSync(
    `convert ${SRC} -resize 32x32 -define icon:auto-resize=16,32 ${OUT}`,
    { stdio: 'inherit' }
);
console.log('Wrote', OUT);
