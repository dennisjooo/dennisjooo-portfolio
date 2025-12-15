export const ERROR_MESSAGES = [
    'git checkout sanity',
    'undefined is not a function',
    '404: Brain not found',
    'SEGFAULT: Reality not loaded',
    'npm ERR! page not found',
    'TypeError: this.page is null',
    'Connection to reality refused',
    'sudo find / -name "page"',
    'Error: Cannot read property "path"',
    'Exception: Lost in the void',
];

export const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ</>{}[];'.split('');

// Matrix Rain performance settings
export const MATRIX_RAIN_CONFIG = {
    desktop: {
        columns: 25,
        charsPerColumn: 18,
        minDuration: 3,
        maxDuration: 7,
    },
    mobile: {
        columns: 12,
        charsPerColumn: 12,
        minDuration: 5,
        maxDuration: 8,
    },
} as const;
