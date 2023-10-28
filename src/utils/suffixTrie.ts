export class Node {
  isEndOfWord: boolean
  children: Record<string, Node>

  constructor () {
    this.children = {}
    this.isEndOfWord = false
  }
}

class SuffixTrie {
  root: Node

  constructor() {
    this.root = new Node()
  }

  insert(word: string): void {
    let node = this.root

    const reversedWord = word.split("").reverse().join("")

    for (let char of reversedWord) {
      if (!node.children[char]) {
        node.children[char] = new Node()
      }
      node = node.children[char]
    }
    node.isEndOfWord = true
  }

  search(word: string): boolean {
    let node = this.root
    for (let char of word) {
      if (!node.children.char) return false
      node = node.children.char
    }
    return node.isEndOfWord
  }

}

export default SuffixTrie