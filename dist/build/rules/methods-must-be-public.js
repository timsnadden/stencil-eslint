import { getDecorator, isPrivate, stencilComponentContext } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches Stencil Methods marked as private or protected.',
            category: 'Possible Errors',
            recommended: true
        },
        schema: [],
        type: 'problem'
    },
    create(context) {
        const stencil = stencilComponentContext();
        const parserServices = context.parserServices;
        return Object.assign(Object.assign({}, stencil.rules), { 'MethodDefinition[kind=method]': (node) => {
                if (stencil.isComponent() && getDecorator(node, 'Method')) {
                    const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                    if (isPrivate(originalNode)) {
                        context.report({
                            node: node,
                            message: `Class methods decorated with @Method() cannot be private nor protected`
                        });
                    }
                }
            } });
    }
};
export default rule;
