'use strict';

var css = require('@master/css');
var validateCss = require('./validate-css.cjs');

/**
 * @description Report errors for a given class. For pure validity, use the more performant `isClassValid()`.
 * @argument syntax A potential Master CSS syntactic class
 * @argument css a Master CSS instance
 */ function validate(syntax, css$1 = new css.MasterCSS()) {
    const rules = css$1.generate(syntax);
    if (rules.length) {
        const errors = [];
        for (const eachRule of rules){
            const syntaxErrors = validateCss.default(eachRule.text);
            for (const eachSyntaxError of syntaxErrors){
                eachSyntaxError.class = syntax;
                errors.push(eachSyntaxError);
            }
        }
        return {
            matched: true,
            errors
        };
    } else {
        return {
            matched: false,
            errors: [
                {
                    class: syntax,
                    message: `'${syntax}' is not a valid Master CSS class`,
                    rawMessage: 'Mismatch'
                }
            ]
        };
    }
}

module.exports = validate;
