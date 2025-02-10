'use strict';

var css = require('@master/css');
var validateCss = require('./validate-css.cjs');

/**
 * @argument syntax A potential Master CSS syntactic class
 * @argument css a Master CSS instance
 */ function generateValidRules(syntax, css$1 = new css.MasterCSS()) {
    const rules = css$1.generate(syntax);
    if (rules.length) {
        for (const eachRule of rules){
            if (validateCss.default(eachRule.text).length) {
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

module.exports = generateValidRules;
