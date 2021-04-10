// Terminal symbols
// Non-terminal symbols
// Production rules
// Start symbol

function s(n) {
    let output = "";
    for (let i = 0; i < n; i++) {
        output += " ";
    }
    return output;
}

let q = JSON.stringify

// current issue to resolve is the fact that there can be multiple possible subInputs that can be returned, so you find them all and then return them all.
// we will switch to breadth first search instead of depth first search so that left recursion won't be an issue

function CFG(symbols, startingSymbol) {
    return (input) => {
        let symbol = symbols[startingSymbol];
        let queue = symbol;

        while (queue.length > 0) {
            rule = queue.shift();

            let passedRule = true;
            let subInput = input;




            parts:
            for (let part of rule) {
                if (part.type === "text") {
                    if (subInput.length < part.value.length) {
                        passedRule = false;
                        break parts;
                    }
                    for (let char of part.value) {
                        if (char != subInput[0]) {
                            passedRule = false;
                            break parts;
                        }
                        subInput = subInput.substr(1);
                    }
                } else {

                    queue = [...queue, ...symbols[part.value]];

                    // let [passedSymbol, cfgSubInput] = CFG(symbols, part.value)(subInput);
                    // subInput = cfgSubInput;
                    // if (!passedSymbol) {
                    //     passedRule = false;
                    //     break;
                    // }
                }
            }

            if (passedRule) {
                if (subInput.length === 0)
                    return true;
            }
        }
    }
}


function r(terminals, ...nonTerminals) {
    let output = [];
    for (let [index, text] of Object.entries(terminals)) {
        if (text.length > 0) {
            output.push({
                type: "text",
                value: text
            });
        }
        if (nonTerminals[index]) {
            output.push({
                type: "nt",
                value: nonTerminals[index]
            })
        }
    }
    return output;
}

let epsilon = r``;

console.log(CFG({
    A: [r`hello`, r`${'B'}${'A'}!`, r`${'B'}`, r`${'C'}`],
    // A: hello
    // A: A!A!
    // A: B

    // B: bruh

    B: [r`bruh`],
    C: [epsilon]
}, "A")("bruhbruh!"));