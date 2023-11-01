export class Node {
  isEndOfWord: boolean;

  children: Record<string, Node>;

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class SuffixTrie {
  root: Node;

  constructor() {
    this.root = new Node();
  }

  insert(word: string): void {
    let node = this.root;

    const reversedWord = word.split('').reverse().join('');

    for (let i = 0; i < reversedWord.length; i += 1) {
      const char = reversedWord[i];
      if (Object.prototype.hasOwnProperty.call(node.children, char)) {
        node.children[char] = new Node();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }
}

export default SuffixTrie;
