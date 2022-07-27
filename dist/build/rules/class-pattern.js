import { getDecorator, parseDecorator, stencilComponentContext } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches usages of non valid class names.',
            category: 'Possible Errors',
            recommended: false
        },
        schema: [
            {
                type: 'object',
                properties: {
                    pattern: {
                        type: 'string'
                    },
                    ignoreCase: {
                        type: 'boolean'
                    }
                },
                additionalProperties: false
            }
        ],
        type: 'problem'
    },
    create(context) {
        const stencil = stencilComponentContext();
        const parserServices = context.parserServices;
        return Object.assign(Object.assign({}, stencil.rules), { 'ClassDeclaration': (node) => {
                const component = getDecorator(node, 'Component');
                const options = context.options[0];
                const { pattern, ignoreCase } = options || {};
                if (!component || !options || !pattern) {
                    return;
                }
                const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                const className = originalNode.symbol.escapedName;
                const regExp = new RegExp(pattern, ignoreCase ? 'i' : undefined);
                if (!regExp.test(className)) {
                    const [opts] = parseDecorator(component);
                    if (!opts || !opts.tag) {
                        return;
                    }
                    context.report({
                        node: node,
                        message: `The class name in component with tag name ${opts.tag} is not valid (${regExp}).`
                    });
                }
            } });
    }
};
export default rule;
