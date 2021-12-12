let id = 0;

class Tree {
    name: string;
    children?: Tree[];
    id: number;

    constructor(name: string, ...children: Tree[]) {
        this.name = name;
        if (id > 1e6) id = 0;
        this.id = id++;
        if (children.length) {
            this.children = children;
        }
    }
}

export default Tree;
