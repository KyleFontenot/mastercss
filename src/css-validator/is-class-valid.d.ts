import { Config, MasterCSS } from '@master/css';
/**
 * Validates that the string is valid Master CSS class syntax.
 * @argument syntax A potential Master CSS syntactic class
 * @argument options Options for creating a new Master CSS instance
 * @returns boolean
 */
export default function isClassValid(syntax: string, options?: {
    css?: MasterCSS;
    config?: Config;
}): boolean;
