import ts from 'typescript';
import { getDecorator } from '../utils';
const rule = {
    meta: {
        docs: {
            description: 'This rule catches modules that expose more than just the Stencil Component itself.',
            category: 'Possible Errors',
            recommended: true
        },
        schema: [],
        type: 'problem'
    },
    create(context) {
        const parserServices = context.parserServices;
        const typeChecker = parserServices.program.getTypeChecker();
        return {
            'ClassDeclaration': (node) => {
                const component = getDecorator(node, 'Component');
                if (component) {
                    const originalNode = parserServices.esTreeNodeToTSNodeMap.get(node);
                    const nonTypeExports = typeChecker.getExportsOfModule(typeChecker.getSymbolAtLocation(originalNode.getSourceFile()))
                        .filter(symbol => (symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) === 0)
                        .filter(symbol => symbol.name !== originalNode.name.text);
                    nonTypeExports.forEach(symbol => {
                        var _a;
                        const errorNode = (symbol.valueDeclaration)
                            ? parserServices.tsNodeToESTreeNodeMap.get(symbol.valueDeclaration).id
                            : parserServices.tsNodeToESTreeNodeMap.get((_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0]);
                        context.report({
                            node: errorNode,
                            message: `To allow efficient bundling, modules using @Component() can only have a single export which is the component class itself. Any other exports should be moved to a separate file. For further information check out: https://stenciljs.com/docs/module-bundling`
                        });
                    });
                }
            }
        };
    }
};
export default rule;
