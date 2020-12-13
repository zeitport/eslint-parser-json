'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: 'paranoid',
        docs: {
            description: 'Test if the code can be parsed as JSON.',
            category: 'Possible Errors',
            recommended: true
        },
        fixable: 'code',
        schema: []
    },
    create: function(context) {
        return {
            Program: node => {
                const sourceCode = context.getSourceCode();

                try {
                    JSON.parse(sourceCode.text);
                } catch (error) {
                    let position = null;
                    let errorLoc = null;

                    if (error.message.indexOf('at location ')) {
                        position = Number.parseInt(error.message.split(' ').reverse()[0]);

                        let line = 0;
                        let column = 0;

                        for(let i = 0; i < sourceCode.lineStartIndices.length; i++) {
                            const index = sourceCode.lineStartIndices[i];

                            if (position < index) {
                                const previousIndex = sourceCode.lineStartIndices[i - 1];
                                line = i;
                                column = position - previousIndex;
                                break;
                            }
                        }

                        errorLoc = {
                            start: {
                                line,
                                column
                            }
                        };
                    }


                    const loc = errorLoc || node.loc;

                    context.report({
                        node,
                        loc,
                        message: error.message
                    });
                }
            }
        };
    }
};
