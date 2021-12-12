import LexicalAnalyzer from "./LexicalAnalyzer";
import Tree from "./Tree";
import {Result, Token} from "./util";
import {AssertionError} from "assert";

class Parser {
    private lex!: LexicalAnalyzer;

    public parse(expression: string): Tree {
        this.lex = new LexicalAnalyzer(expression);
        this.lex.nextToken();
        const tree = this.E() as Tree;
        if (this.lex.getToken() !== Token.END) {
            throw new AssertionError({message: "Invalid expression"});
        }
        return tree;
    }

    private E(): Result {
        switch (this.lex.getToken()) {
            case Token.VAR:
            case Token.NOT:
            case Token.LPAREN:
                return new Tree("E", ...Parser.getNonEmpty(this.T(), this.E1()));
            default:
                throw new AssertionError({message: "Expected variable, 'not' or '('"});
        }
    }

    private E1(): Result {
        switch (this.lex.getToken()) {
            case Token.OR:
            case Token.XOR:
                const op = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("E'", ...Parser.getNonEmpty(op, this.T(), this.E1()));
            default:
                return "";
        }
    }

    private T(): Result {
        switch (this.lex.getToken()) {
            case Token.VAR:
            case Token.NOT:
            case Token.LPAREN:
                return new Tree("T", ...Parser.getNonEmpty(this.F(), this.T1()));
            default:
                throw new AssertionError({message: "Expected variable, 'not' or '('"});
        }
    }

    private T1(): Result {
        switch (this.lex.getToken()) {
            case Token.AND:
                const op = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("T'", ...Parser.getNonEmpty(op, this.F(), this.T1()));
            default:
                return "";
        }
    }

    private F(): Result {
        switch (this.lex.getToken()) {
            case Token.VAR:
                const n = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("F", n);
            case Token.NOT:
                const op = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("F", ...Parser.getNonEmpty(op, this.F()));
            case Token.LPAREN:
                const children: Result[] = [new Tree(this.lex.getTokenName())]
                this.lex.nextToken();
                children.push(this.E());
                if (this.lex.getToken() !== Token.RPAREN) {
                    throw new AssertionError({message: "Unclosed brackets"});
                }
                children.push(new Tree(Token.RPAREN));
                this.lex.nextToken();
                return new Tree("F", ...Parser.getNonEmpty(...children));
            default:
                throw new AssertionError({message: "Expected variable, 'not' or '('"});
        }
    }

    private static getNonEmpty(...nodes: Result[]): Tree[] {
        return nodes.filter(node => node !== '') as Tree[];
    }
}

export default Parser;