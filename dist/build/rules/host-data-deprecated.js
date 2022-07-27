/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery <tom.chinery@addtoevent.co.uk>
 */
import { stencilComponentContext } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches usage of hostData method.',
            category: 'Possible Errors',
            recommended: true
        },
        schema: [],
        type: 'problem'
    },
    create(context) {
        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        const stencil = stencilComponentContext();
        return Object.assign(Object.assign({}, stencil.rules), { 'MethodDefinition[key.name=hostData]': (node) => {
                if (stencil.isComponent()) {
                    context.report({
                        node: node.key,
                        message: `hostData() is deprecated and <Host> should be used in the render function instead.`
                    });
                }
            } });
    }
};
export default rule;
