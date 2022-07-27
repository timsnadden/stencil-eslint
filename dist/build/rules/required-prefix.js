import { getDecorator, parseDecorator, stencilComponentContext } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches required prefix in component tag name.',
            category: 'Possible Errors',
            recommended: false
        },
        schema: [
            {
                type: 'array',
                minLength: 1,
                additionalProperties: false
            }
        ],
        type: 'layout'
    },
    create(context) {
        const stencil = stencilComponentContext();
        return Object.assign(Object.assign({}, stencil.rules), { 'ClassDeclaration': (node) => {
                const component = getDecorator(node, 'Component');
                if (!component) {
                    return;
                }
                const [{ tag }] = parseDecorator(component);
                const options = context.options[0];
                const match = options.some((t) => tag.startsWith(t));
                if (!match) {
                    context.report({
                        node: node,
                        message: `The component with tagName ${tag} have not a valid prefix.`
                    });
                }
            } });
    }
};
export default rule;
