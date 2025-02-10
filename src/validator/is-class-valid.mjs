import { MasterCSS } from '@master/css';
import validateCSS from './validate-css.mjs';

/**
 * Validates that the string is valid Master CSS class syntax.
 * @argument syntax A potential Master CSS syntactic class
 * @argument css a Master CSS instance
 */ function isClassValid(syntax, css = new MasterCSS()) {
    const rules = css.generate(syntax);
    if (rules.length) {
        for (const eachRule of rules){
            if (validateCSS(eachRule.text).length) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

export { isClassValid as default };
