'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cssTree = require('css-tree');

// @ts-expect-error
function validateCSS(text, parseOptions = {
    parseAtrulePrelude: false,
    parseRulePrelude: false,
    parseValue: false,
    parseCustomProperty: false
}) {
    const errors = [];
    const ast = cssTree.parse(text, {
        ...parseOptions,
        onParseError (error) {
            errors.push(error);
        }
    });
    cssTree.walk(ast, {
        visit: 'Atrule',
        enter (node) {
            errors.push(...validateAtrule(node));
        }
    });
    cssTree.walk(ast, {
        visit: 'Rule',
        enter (node) {
            errors.push(...validateRule(node));
        }
    });
    return errors;
}
function isTargetError(error) {
    if (!error) {
        return null;
    }
    if (error.name !== 'SyntaxError' && error.name !== 'SyntaxMatchError' && error.name !== 'SyntaxReferenceError') {
        return null;
    }
    return error;
}
function validateAtrule(node) {
    const atrule = node.name;
    const errors = [];
    let error;
    if (error = isTargetError(cssTree.lexer.checkAtruleName(atrule))) {
        errors.push(Object.assign(error, {
            atrule
        }));
        return errors;
    }
    errors.push(...validateAtrulePrelude(atrule, node.prelude));
    if (node.block && node.block.children) {
        node.block.children.forEach((child)=>{
            if (child.type === 'Declaration') {
                errors.push(...validateAtruleDescriptor(atrule, child.property, child.value));
            }
        });
    }
    return errors;
}
function validateAtrulePrelude(atrule, prelude) {
    const errors = [];
    let error;
    if (error = isTargetError(cssTree.lexer.checkAtrulePrelude(atrule, prelude))) {
        errors.push(Object.assign(error, {
            atrule
        }));
    } else if (error = isTargetError(cssTree.lexer.matchAtrulePrelude(atrule, prelude).error)) {
        errors.push(Object.assign(error, {
            atrule,
            ...error.rawMessage === 'Mismatch' && {
                details: error.message,
                message: 'Invalid value for `@' + atrule + '` prelude'
            }
        }));
    }
    return errors;
}
function validateAtruleDescriptor(atrule, descriptor, value) {
    const errors = [];
    let error;
    if (error = isTargetError(cssTree.lexer.checkAtruleDescriptorName(atrule, descriptor))) {
        errors.push(Object.assign(error, {
            atrule,
            descriptor
        }));
    } else {
        if (error = isTargetError(cssTree.lexer.matchAtruleDescriptor(atrule, descriptor, value).error)) {
            errors.push(Object.assign(error, {
                atrule,
                descriptor,
                ...error.rawMessage === 'Mismatch' && {
                    details: error.message,
                    message: 'Invalid value for `' + descriptor + '` descriptor'
                }
            }));
        }
    }
    return errors;
}
function validateDeclaration(property, value) {
    const errors = [];
    let error;
    if (cssTree.property(property).custom) {
        return errors;
    }
    if (error = isTargetError(cssTree.lexer.checkPropertyName(property))) {
        errors.push(Object.assign(error, {
            property
        }));
    } else if (error = isTargetError(cssTree.lexer.matchProperty(property, value).error)) {
        errors.push(Object.assign(error, {
            property,
            ...error.rawMessage === 'Mismatch' && {
                details: error.message,
                message: 'Invalid value for `' + property + '` property'
            }
        }));
    }
    return errors;
}
function validateRule(node) {
    const errors = [];
    if (node.block && node.block.children) {
        node.block.children.forEach((child)=>{
            if (child.type === 'Declaration') {
                errors.push(...validateDeclaration(child.property, child.value));
            }
        });
    }
    return errors;
}

exports.default = validateCSS;
exports.validateAtrule = validateAtrule;
exports.validateAtruleDescriptor = validateAtruleDescriptor;
exports.validateAtrulePrelude = validateAtrulePrelude;
exports.validateDeclaration = validateDeclaration;
exports.validateRule = validateRule;
