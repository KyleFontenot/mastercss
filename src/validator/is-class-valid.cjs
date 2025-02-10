'use strict';

var css = require('@master/css');
var validateCss = require('./validate-css.cjs');

/**
 * Validates that the string is valid Master CSS class syntax.
 * @argument syntax A potential Master CSS syntactic class
 * @argument css a Master CSS instance
 */ function isClassValid(syntax, css$1 = new css.MasterCSS()) {
    const rules = css$1.generate(syntax);
    if (rules.length) {
        for (const eachRule of rules){
            if (validateCss.default(eachRule.text).length) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

module.exports = isClassValid;
