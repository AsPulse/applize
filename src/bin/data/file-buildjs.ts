export const fileBuildjs = `const { resolve } = require('path');
const { ApplizeBuilder, ApplizeProjectMakeUp } = require('@aspulse/applize');

const builder = new ApplizeBuilder();
ApplizeProjectMakeUp(builder, {
    serverEntryPoint: resolve(__dirname, 'src/index.ts'),
    pagesDirectory: resolve(__dirname, 'pages'),
    publicDirectory: resolve(__dirname, 'public'),
    distDirectory: resolve(__dirname, 'dist'),
    entryHTML: resolve(__dirname, 'entry', 'index.html'),
    entryTS: resolve(__dirname, 'entry', 'index.ts'),
});
builder.run();
`;
