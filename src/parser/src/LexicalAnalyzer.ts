import {blanks, operations, ParseException, Token} from "./util";

class LexicalAnalyzer {
    private readonly expression: string;
    private curPos: number = -1;
    private curChar!: string;
    private curToken!: Token;
    private lastVariable!: string;

    constructor(expression: string) {
        this.expression = expression + '$';
    }

    public nextToken(): void | ParseException {
        this.nextChar();
        this.skipWS();
        switch (true) {
            case this.isLetter():
                this.curToken = this.getVariableOrOperation();
                return;
            case this.isLParen():
                this.curToken = Token.LPAREN;
                return;
            case this.isRParen():
                this.curToken = Token.RPAREN;
                return;
            case this.isEnd():
                this.curToken = Token.END;
                return;
            default:
                throw new Error(`Illegal char '${this.curChar}' at position ${this.curPos}`);
        }
    }

    public getToken(): Token {
        return this.curToken;
    }

    public getPos(): number {
        return this.curPos;
    }

    public getTokenName(): string {
        return this.curToken === Token.VAR ? this.lastVariable : this.curToken;
    }

    private nextChar(): void | ParseException {
        this.curChar = this.expression[++this.curPos];
    }

    private prevChar(): void | ParseException {
        this.curChar = this.expression[--this.curPos];
    }

    private getVariableOrOperation() : Token {
        let token: string = '';
        while (this.isLetter()) {
            token += this.curChar;
            this.nextChar();
        }
        this.prevChar();
        this.lastVariable = token.length === 1 ? token : '';
        if (!operations[token] && !this.lastVariable) {
            throw new Error(`Illegal variable '${token}' at pos ${this.curPos}`)
        }
        return operations[token] || Token.VAR;
    }


    private isMatch(regex: RegExp) : boolean {
        return regex.test(this.curChar);
    }

    private isLetter() : boolean {
        return this.isMatch(/^[a-z]$/);
    }

    private isLParen() : boolean {
        return this.isMatch(/^\($/);
    }

    private isRParen() : boolean {
        return this.isMatch(/^\)$/);
    }

    private isEnd() : boolean {
        return this.isMatch(/^\$$/);
    }

    private skipWS(): void {
        while (blanks.includes(this.curChar)) {
            this.nextChar();
        }
    }
}


export default LexicalAnalyzer;