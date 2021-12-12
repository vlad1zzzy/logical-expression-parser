import {generateCorrectExpressions, generateIncorrectExpressions} from "./test-generator";
import Parser from "../parser/src/Parser";
import assert from "assert";

const PARSER = new Parser();
const CORRECT: string[] = generateCorrectExpressions();
const INCORRECT: string[] = generateIncorrectExpressions();

describe('Testing...', function () {
    CORRECT.forEach(expr => {
        test(`VALID: ${expr}`, function () {
            PARSER.parse(expr);
        });
    })

    INCORRECT.forEach(expr => {
        test(`INVALID: ${expr}`, function () {
            assert.throws(() => PARSER.parse(expr));
        });
    })
});