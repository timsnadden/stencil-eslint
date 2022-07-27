const rule = {
    meta: {
        docs: {
            description: 'This rule catches exports of const enums',
            category: 'Possible Errors',
            recommended: true
        },
        schema: [],
        type: 'problem'
    },
    create(context) {
        return {
            'ExportNamedDeclaration > TSEnumDeclaration[const]': (node) => {
                context.report({
                    node: node,
                    message: `Exported const enums are not allowed`
                });
            }
        };
    }
};
export default rule;
