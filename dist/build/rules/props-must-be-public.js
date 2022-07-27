import { getDecorator, isPrivate, stencilComponentContext } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches Stencil Props marked as private or protected.',
            category: 'Possible Errors',
            recommended: true
        },
        schema: [],
        type: 'problem',
    },
    create(context) {
        const stencil = stencilComponentContext();
        const parserServices = context.parserServices;
        return Object.assign(Object.assign({}, stencil.rules), { 'PropertyDefinition': (node) => {
                if (stencil.isComponent() && getDecorator(node, 'Prop')) {
                    const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                    if (isPrivate(originalNode)) {
                        context.report({
                            node: node,
                            message: `Class properties decorated with @Prop() cannot be private nor protected`
                        });
                    }
                }
            } });
    }
};
export default rule;
