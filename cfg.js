function CFG(symbols, startingSymbol) {

    return (input) => {
        // init

        let S = [symbols[startingSymbol].map(s => ({ parts: s, cursor: 0, fromState: 0, from: startingSymbol }))]; // cursor represents progress

        for (let nonTerminal of [...S[0]]) { // [...S[0]] is just copying array
            let nextPart = nonTerminal.parts[nonTerminal.cursor];
            if (nextPart.type === "nt") {

                S[0] = [...S[0], ...symbols[nextPart.value].map(s => ({ parts: s, cursor: 0, fromState: 0, from: nonTerminal.parts[nonTerminal.cursor].value }))]
            }
        }
        S[0] = S[0].filter((v, index, arr) => arr.findIndex(x => (JSON.stringify(x) === JSON.stringify(v))) === index); // forces unique object array



        // runner

        for (let [index, c] of Object.entries(input)) {
            index = +index;
            S[index + 1] = [];

            let finishedNonTerminals = [];

            for (let nonTerminal of S[index]) { // find terminals that complete
                let nextPart = nonTerminal.parts[nonTerminal.cursor];
                if (nextPart?.type === "t" && nextPart.value === c) {
                    if (nonTerminal.cursor + 1 === nonTerminal.parts.length)
                        finishedNonTerminals.push(nonTerminal);
                    let toAdd = { ...nonTerminal, cursor: nonTerminal.cursor + 1 };
                    if (!S[index + 1].find(x => JSON.stringify(x) === JSON.stringify(toAdd)))
                        S[index + 1] = [...S[index + 1], toAdd];
                }

            }

            for (let fNT of finishedNonTerminals) {
                for (let nonTerminal of S[fNT.fromState]) {
                    let nextPart = nonTerminal.parts[nonTerminal.cursor];
                    if (nextPart?.type === "nt" && fNT.from === nextPart.value) {
                        if (nonTerminal.cursor + 1 === nonTerminal.parts.length && !finishedNonTerminals.find(x => JSON.stringify(x) === JSON.stringify(nonTerminal)))
                            finishedNonTerminals.push(nonTerminal);
                        let toAdd = { ...nonTerminal, cursor: nonTerminal.cursor + 1 };
                        if (!S[index + 1].find(x => JSON.stringify(x) === JSON.stringify(toAdd)))
                            S[index + 1] = [...S[index + 1], toAdd];
                    }
                }
            }

            let addedOnes = S[index + 1];
            while (addedOnes.length !== 0) {
                let addedOnesCopy = [...addedOnes];
                addedOnes = [];
                for (let nonTerminal of addedOnesCopy) {
                    let nextPart = nonTerminal.parts[nonTerminal.cursor];
                    if (nextPart?.type === "nt") {// optional chaining such that it only checks if it exists
                        let toAdd = symbols[nextPart.value].map(s => ({ parts: s, cursor: 0, fromState: index + 1, from: nonTerminal.parts[nonTerminal.cursor].value }));
                        toAdd = toAdd.filter(y => !S[index + 1].find(x => JSON.stringify(x) === JSON.stringify(y)))
                        if (!S[index + 1].find(x => JSON.stringify(x) === JSON.stringify(toAdd))) {
                            S[index + 1] = [...S[index + 1], ...toAdd];
                            addedOnes = [...addedOnes, ...toAdd];
                        }
                    }
                }
            }
        }

        // final
        return !!S[input.length].find(x => x.fromState === 0);
    }
}


function r(terminals, ...nonTerminals) { // this represents rules // done 
    let parts = [];
    for (let [index, text] of Object.entries(terminals)) {
        if (text.length > 0) {
            for (let c of text) {
                parts.push({
                    type: "t",
                    value: c
                });
            }
        }
        if (nonTerminals[index]) {
            parts.push({
                type: "nt",
                value: nonTerminals[index]
            })
        }
    }
    return parts;
}

let epsilon = r``;

// console.log(CFG({
//     term: [r`${'number'}+${'term'}`, r`${'number'}`],
//     number: [r`0`, r`1`, r`2`, r`3`, r`4`, r`5`, r`6`, r`7`, r`8`, r`9`]
// }, 'term')("1+9"));

console.log(CFG({
    A: [
        r`hello`,
        r`${'B'}${'A'}!`,
        r`${'A'}${'B'}`,
        r`${'B'}`,
        // r`${'C'}`
    ],
    B: [
        r`bruh`,
        r`test`
    ],
    // C: [epsilon]
}, "A")("bruhhellobruhtestbruh!"));