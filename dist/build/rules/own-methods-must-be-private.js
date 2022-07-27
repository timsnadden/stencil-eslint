import { isPrivate, stencilComponentContext, stencilDecorators, stencilLifecycle } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches own class methods marked as public.',
            category: 'Possible Errors',
            recommended: true
        },
        schema: [],
        type: 'problem',
    },
    create(context) {
        const stencil = stencilComponentContext();
        const parserServices = context.parserServices;
        return Object.assign(Object.assign({}, stencil.rules), { 'MethodDefinition[kind=method]': (node) => {
                if (!stencil.isComponent()) {
                    return;
                }
                const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                const stencilDecorator = originalNode.decorators && originalNode.decorators.some((dec) => stencilDecorators.includes(dec.expression.expression.escapedText));
                const stencilCycle = stencilLifecycle.includes(originalNode.name.escapedText);
                if (!stencilDecorator && !stencilCycle && !isPrivate(originalNode)) {
                    context.report({
                        node: node,
                        message: `Own class methods cannot be public`
                    });
                }
            } });
    }
};
export default rule;
