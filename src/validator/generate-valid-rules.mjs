import { MasterCSS } from '@master/css';
import validateCSS from './validate-css.mjs';

/**
 * @argument syntax A potential Master CSS syntactic class
 * @argument css a Master CSS instance
 */ function generateValidRules(syntax, css = new MasterCSS()) {
    const rules = css.generate(syntax);
    if (rules.length) {
        for (const eachRule of rules){
            if (validateCSS(eachRule.text).length) {
                return [];
            } else {
                continue;
            }
        }
        return rules;
    } else {
        return [];
    }
}

export { generateValidRules as default };
