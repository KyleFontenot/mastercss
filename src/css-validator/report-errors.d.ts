import { SyntaxError } from './interfaces/syntax-error';
import { Config, MasterCSS } from '@master/css';
/**
 * @description Report errors for a given class. For pure validity, use the more performant `isClassValid()`.
 * @argument syntax A potential Master CSS syntactic class
 * @argument options Options for creating a new Master CSS instance
 * @returns SyntaxError[]
 */
export default function reportErrors(syntax: string, options?: {
    css?: MasterCSS;
    config?: Config;
}): SyntaxError[];
