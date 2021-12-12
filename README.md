# Ручное построение нисходящих синтаксических анализаторов

### Логические формулы в стиле Python
Логические формулы. Используются операции and, or, xor, not. Приоритет операций стандартный. Скобки могут использоваться для изменения приоритета.
В качестве операндов выступают переменные с именем из одной буквы. Используйте один терминал для всех переменных. Для каждой логической операции должен быть заведен один терминал (не три ‘a’, ‘n’,
‘d’ для and).

#### Пример: (a and b) or not (c xor (a or not b))

### [Исходный код](https://github.com/vlad1zzzy/logical-expression-parser/tree/master/src/parser/src)

### [Визуализация](http://vlad1zzzy.github.io/logical-expression-parser)

## Grammar

* E  -> TE'
* E' -> or TE'
* E' -> xor TE'
* E' -> eps
* T  -> FT'
* T' -> and FT'
* T' -> eps
* F  -> not F
* F  -> (E)
* F  -> n

|     |    FIRST   |     FOLLOW     |           Description                 |
| --- | ---------- | -------------- |    ------------------------------     |
|  E  | n ( not    | $ )            |            expression                 |
|  E' | eps or xor | $ )            |          tail of or/xor               |
|  T  | n ( not    | $ ) or xor     |           head of and                 |
|  T' | eps and    | $ ) or xor     |           tail of and                 |
|  F  | n ( not    | $ ) or xor and | head of not/(expression)/variable     |

## Lexis

| TERM  |    TOKEN   |  
| ----- | ---------- | 
|   n   |    VAR     |
|  and  |    AND     |
|  or   |     OR     |
|  xor  |    XOR     |
|  not  |    NOT     |
|   (   |   LPAREN   |
|   )   |   RPAREN   |
|   $   |    END     |