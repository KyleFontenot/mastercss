import { Config, MasterCSS, Rule } from '@master/css';
/**
 * @argument syntax A potential Master CSS syntactic class
 * @argument options Options for creating a new Master CSS instance
 * @returns Valid rules
 */
export default function createValidRules(syntax: string, options?: {
    css?: MasterCSS;
    config?: Config;
}): Rule[];
