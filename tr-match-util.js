const _eval = require('eval')



//Prints context to string
function buildContextString(context) {
    try {
        return Object.keys(context).map(v => `let ${v}=${JSON.stringify(context[v])}`).join(';')
    } catch (e) {}
    return '';
}


function buildCustomOperators() {
    return `
  String.prototype.IN = function (arr){ return arr.includes(this.toString())};
  String.prototype.NOTIN = function (arr){ return !arr.includes(this.toString())};  
  `;
}

/*Maps Following Task Router Expression operators to javascript operators:
CONTAINS , HAS , IN , NOT IN , AND , OR 
Refer: https://www.twilio.com/docs/taskrouter/expression-syntax 
*/

function buildEvaluationString(expression) {
    let exp = expression.replace(/\sOR\s/gi, ' || ').replace(/\sAND\s/gi, ' && ');
    exp = exp.replace(/\s+NOT\s+IN\s+\[.*?\]/gi, (x) => x.replace(/\s+NOT\s+IN\s+/gi, '.NOTIN(') + ')')
    exp = exp.replace(/\s+IN\s+\[.*?\]/gi, (x) => x.replace(/\s+IN\s+/gi, '.IN(') + ')')
    exp = exp.replace(/\s+HAS\s+[\"?\w\.\-\_]*/gi, (x) => x.replace(/\s+HAS\s+/gi, '.includes(') + ')')
    exp = exp.replace(/\s+CONTAINS\s+[\"?\w\.]*/gi, (x) => x.replace(/\s+CONTAINS\s+/gi, '.includes(') + ')')
    return exp;
}

function evaluateExpression(expression, context) {
    const customOperators = buildCustomOperators();
    const contextString = buildContextString(context);
    const patchedExpression = buildEvaluationString(expression);
    const combinedString = `${customOperators}; ${contextString};exports.result = (${patchedExpression})`;
    const {
        result
    } = _eval(combinedString);
    return result;
}


module.exports = {
    evaluateExpression
}
