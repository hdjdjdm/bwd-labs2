import { register } from 'tsconfig-paths';
import tsConfig from './tsconfig.json';

register({
    baseUrl: tsConfig.compilerOptions.outDir,
    paths: tsConfig.compilerOptions.paths,
});
