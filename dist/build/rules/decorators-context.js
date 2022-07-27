import { stencilComponentContext } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches Stencil Decorators used in incorrect locations.',
            category: 'Possible Errors',
            recommended: true
        },
        schema: [],
        type: 'problem'
    },
    create(context) {
        const stencil = stencilComponentContext();
        return Object.assign(Object.assign({}, stencil.rules), { 'Decorator': (node) => {
                if (!stencil.isComponent()) {
                    return;
                }
                if (node.expression && node.expression.callee) {
                    const decName = node.expression.callee.name;
                    if (decName === 'Prop' ||
                        decName === 'State' ||
                        decName === 'Element' ||
                        decName === 'Event') {
                        if (node.parent.type !== 'PropertyDefinition') {
                            context.report({
                                node: node,
                                message: `The @${decName} decorator can only be applied to class properties.`
                            });
                        }
                    }
                    else if (decName === 'Method' ||
                        decName === 'Watch' ||
                        decName === 'Listen') {
                        if (node.parent.type !== 'MethodDefinition') {
                            context.report({
                                node: node,
                                message: `The @${decName} decorator can only be applied to class methods.`
                            });
                        }
                    }
                    else if (decName === 'Component') {
                        if (node.parent.type !== 'ClassDeclaration') {
                            context.report({
                                node: node,
                                message: `The @${decName} decorator can only be applied to a class.`
                            });
                        }
                    }
                }
            } });
    }
};
export default rule;
