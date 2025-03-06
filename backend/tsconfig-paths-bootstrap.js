const { register } = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

register({
    baseUrl: tsConfig.compilerOptions.outDir,
    paths: tsConfig.compilerOptions.paths,
});
