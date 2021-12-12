const vars = ['a', 'b', 'c'];
const binary = ['or', 'xor', 'and'];
const not = (expr: string) => `not ${expr}`
const brackets = (expr: string) => `(${expr})`

export const generateCorrectExpressions = () => {
    const tests: string[] = [];
    vars.forEach((v) => {
        tests.push(v);
        tests.push(not(v));
        tests.push(not(not(v)));
        tests.push(brackets(not(v)));
        tests.push(brackets(brackets(v)));
        tests.push(not(brackets(v)));
        binary.forEach((bin) => {
            tests.push(`${v} ${bin} ${v}`);
            tests.push(brackets(`${v} ${bin} ${v}`));
            tests.push(`${brackets(`${v} ${bin} ${v}`)} ${bin} ${v}`);
            tests.push(`${brackets(`${v} ${bin} ${v}`)} ${bin} ${brackets(`${v} ${bin} ${v}`)}`);

            tests.push(not(`${v} ${bin} ${v}`));
            tests.push(not(brackets(`${not(v)} ${bin} ${not(v)}`)));
            tests.push(not(`${brackets(`${not(v)} ${bin} ${not(v)}`)} ${bin} ${not(v)}`));
            tests.push(not(`${brackets(`${not(v)} ${bin} ${not(v)}`)} ${bin} ${brackets(`${not(v)} ${bin} ${not(v)}`)}`));
        })
        tests.push('(a and b) or not (c xor (a or not b))');
        tests.push('a and not (b or not c)');
        tests.push('not a and (not b or x)');
        tests.push('(a xor not a) or (x and not not b)');
    })
    return tests;
}

export const generateIncorrectExpressions = () => {
    const tests: string[] = [];
    tests.push('');
    tests.push('(');
    tests.push(')');
    tests.push('()');
    tests.push('(a');
    tests.push('a)');
    tests.push('not');
    tests.push('not (');
    tests.push('not )');
    tests.push('(not)');
    tests.push('a not');
    tests.push('a a');
    tests.push('A');
    tests.push('asd');
    tests.push('anot');
    tests.push('a(not');
    tests.push('and');
    tests.push('or');
    tests.push('xor');
    tests.push('nota');
    tests.push('ora');
    tests.push('xora');
    tests.push('anda');
    tests.push('( and');
    tests.push('( or');
    tests.push('( xor');
    tests.push('( a and');
    tests.push('( a or');
    tests.push('( a xor');
    tests.push('( a and)');
    tests.push('( a or)');
    tests.push('( a xor)');
    tests.push('a and and');
    tests.push('a or or');
    tests.push('a xor xor');
    tests.push('a and or');
    tests.push('not and');

    return tests;
}