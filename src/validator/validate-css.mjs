import { parse, walk, lexer, property } from 'css-tree';

// @ts-expect-error
function validateCSS(text, parseOptions = {
    parseAtrulePrelude: false,
    parseRulePrelude: false,
    parseValue: false,
    parseCustomProperty: false
}) {
    const errors = [];
    const ast = parse(text, {
        ...parseOptions,
        onParseError (error) {
            errors.push(error);
        }
    });
    walk(ast, {
        visit: 'Atrule',
        enter (node) {
            errors.push(...validateAtrule(node));
        }
    });
    walk(ast, {
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
    if (error = isTargetError(lexer.checkAtruleName(atrule))) {
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
    if (error = isTargetError(lexer.checkAtrulePrelude(atrule, prelude))) {
        errors.push(Object.assign(error, {
            atrule
        }));
    } else if (error = isTargetError(lexer.matchAtrulePrelude(atrule, prelude).error)) {
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
    if (error = isTargetError(lexer.checkAtruleDescriptorName(atrule, descriptor))) {
        errors.push(Object.assign(error, {
            atrule,
            descriptor
        }));
    } else {
        if (error = isTargetError(lexer.matchAtruleDescriptor(atrule, descriptor, value).error)) {
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
function validateDeclaration(property$1, value) {
    const errors = [];
    let error;
    if (property(property$1).custom) {
        return errors;
    }
    if (error = isTargetError(lexer.checkPropertyName(property$1))) {
        errors.push(Object.assign(error, {
            property: property$1
        }));
    } else if (error = isTargetError(lexer.matchProperty(property$1, value).error)) {
        errors.push(Object.assign(error, {
            property: property$1,
            ...error.rawMessage === 'Mismatch' && {
                details: error.message,
                message: 'Invalid value for `' + property$1 + '` property'
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

export { validateCSS as default, validateAtrule, validateAtruleDescriptor, validateAtrulePrelude, validateDeclaration, validateRule };
