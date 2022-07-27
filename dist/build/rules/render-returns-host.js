/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery <tom.chinery@addtoevent.co.uk>
 */
import { stencilComponentContext } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches Stencil Prop names that share names of Global HTML Attributes.',
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
        const parserServices = context.parserServices;
        const typeChecker = parserServices.program.getTypeChecker();
        return Object.assign(Object.assign({}, stencil.rules), { 'MethodDefinition[kind=method][key.name=render] ReturnStatement': (node) => {
                if (!stencil.isComponent()) {
                    return;
                }
                const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node.argument);
                const type = typeChecker.getTypeAtLocation(originalNode);
                if (type && type.symbol && type.symbol.escapedName === 'Array') {
                    context.report({
                        node: node,
                        message: `Avoid returning an array in the render() function, use <Host> instead.`
                    });
                }
            } });
    }
};
export default rule;
