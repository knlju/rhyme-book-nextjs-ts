import { type Node } from '@utils/suffixTrie';
import type SuffixTrie from '@utils/suffixTrie';

export interface Rhyme {
  rhyme: string;
  rhymeLength: number;
}

interface RhymeFindingStrategy {
  findRhymes: (word: string) => Rhyme[];
}

export class SuffixTrieStrategy implements RhymeFindingStrategy {
  private readonly trie: SuffixTrie;

  constructor(trie: SuffixTrie) {
    this.trie = trie;
  }

  static getRhymeLength = (str1: string, str2: string): number => {
    let i = str1.length - 1;
    let j = str2.length - 1;
    let count = 0;
    while (i >= 0 && j >= 0 && str1[i] === str2[j]) {
      count++;
      i--;
      j--;
    }
    return count;
  };

  findRhymes(word: string): Rhyme[] {
    const results: Rhyme[] = [];

    const currentNode = this.trie.root;

    const reversedWord = word.split('').reverse().join('');

    const searchTrie = (node: Node, currentReversedWord: string, index: number) => {
      if (node.isEndOfWord) {
        const actualWord = currentReversedWord.split('').reverse().join('');
        const rhymeValue = SuffixTrieStrategy.getRhymeLength(word, actualWord);
        if (rhymeValue > 0) {
          results.push({ rhyme: actualWord, rhymeLength: rhymeValue });
        }
      }

      if (index < reversedWord.length && node.children[reversedWord[index]]) {
        searchTrie(
          node.children[reversedWord[index]],
          currentReversedWord + reversedWord[index],
          index + 1
        );
      }

      for (const char in node.children) {
        if (char !== reversedWord[index]) {
          searchTrie(node.children[char], currentReversedWord + char, index);
        }
      }
    };

    searchTrie(currentNode, '', 0);

    results.sort((a, b) => b.rhymeLength - a.rhymeLength);

    return results.slice(0, 100);
  }
}

export class RhymeFinder {
  private strategy: RhymeFindingStrategy;

  constructor(strategy: RhymeFindingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: RhymeFindingStrategy) {
    this.strategy = strategy;
  }

  findRhymes(word: string): Rhyme[] {
    return this.strategy.findRhymes(word);
  }
}
