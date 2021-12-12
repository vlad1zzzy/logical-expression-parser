import LexicalAnalyzer from "./LexicalAnalyzer";
import Tree from "./Tree";
import {Token} from "./util";
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

    private E(): Tree {
        switch (this.lex.getToken()) {
            case Token.VAR:
            case Token.NOT:
            case Token.LPAREN:
                return new Tree("E", this.T(), this.E1());
            default:
                throw new AssertionError({message: "Expected variable, 'not' or '('"});
        }
    }

    private E1(): Tree {
        switch (this.lex.getToken()) {
            case Token.OR:
            case Token.XOR:
                const op = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("E'", op, this.T(), this.E1());
            default:
                return new Tree("E'", new Tree('eps'));
        }
    }

    private T(): Tree {
        switch (this.lex.getToken()) {
            case Token.VAR:
            case Token.NOT:
            case Token.LPAREN:
                return new Tree("T", this.F(), this.T1());
            default:
                throw new AssertionError({message: "Expected variable, 'not' or '('"});
        }
    }

    private T1(): Tree {
        switch (this.lex.getToken()) {
            case Token.AND:
                const op = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("T'", op, this.F(), this.T1());
            default:
                return new Tree("T'", new Tree('eps'));
        }
    }

    private F(): Tree {
        switch (this.lex.getToken()) {
            case Token.VAR:
                const n = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("F", n);
            case Token.NOT:
                const op = new Tree(this.lex.getTokenName());
                this.lex.nextToken();
                return new Tree("F", op, this.F());
            case Token.LPAREN:
                const children: Tree[] = [new Tree(this.lex.getTokenName())]
                this.lex.nextToken();
                children.push(this.E());
                if (this.lex.getToken() !== Token.RPAREN) {
                    throw new AssertionError({message: "Unclosed brackets"});
                }
                children.push(new Tree(Token.RPAREN));
                this.lex.nextToken();
                return new Tree("F", ...children);
            default:
                throw new AssertionError({message: "Expected variable, 'not' or '('"});
        }
    }
}

export default Parser;