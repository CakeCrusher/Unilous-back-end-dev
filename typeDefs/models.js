const requireDir = require('require-dir')
const models = requireDir('./models')
var types = ``;
for(type in models){
    types += models[type];
}
module.exports = types + `
type Token {
    value: String!,
}
`;
