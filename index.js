const queueDefs = require('./test-data/queue-definitions.json');
const {evaluateExpression} = require("./tr-match-util")


const WORKER_ATTRIBUTES = {
    "routing": {
        "skills": ["Skill1","Skill2"], 
        "channels": ["Chat", "Call", "Messaging"], 
    },
}


function main(){

    const identifiedQueues = [];
   
    
    for(let q of queueDefs){
        try{
            var exp  = q.expr.replace(/'/ig,'"');
            var matchResult = evaluateExpression(exp,WORKER_ATTRIBUTES);
            if(matchResult==true){
                identifiedQueues.push(q.name);
            }
        }catch(e){
                console.log("err",e);
        }
    }

    console.log({identifiedQueues});

}

main();