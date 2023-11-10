import { type Node } from '@utils/suffixTrie';
import type SuffixTrie from '@utils/suffixTrie';

export interface Rhyme {
  rhyme: string;
  rhymeLength: number;
}

export interface RhymeFindingStrategy {
  findRhymes: (word: string) => Rhyme[];
  getRhymeStrength: (word: string, matchingWord: string) => number;
}

export class SuffixTrieStrategy implements RhymeFindingStrategy {
  private readonly trie: SuffixTrie;

  constructor(trie: SuffixTrie) {
    this.trie = trie;
  }

  getRhymeStrength: (word: string, matchingWord: string) => number;

  static getRhymeStrength(word: string, matchingWord: string): number {
    let i = word.length - 1;
    let j = matchingWord.length - 1;
    let count = 0;
    while (i >= 0 && j >= 0 && word[i] === matchingWord[j]) {
      count += 1;
      i -= 1;
      j -= 1;
    }
    return count;
  }

  findRhymes(word: string): Rhyme[] {
    const results: Rhyme[] = [];

    const currentNode = this.trie.root;

    const reversedWord = word.split('').reverse().join('');

    const searchTrie = (node: Node, currentReversedWord: string, index: number) => {
      if (node.isEndOfWord) {
        const actualWord = currentReversedWord.split('').reverse().join('');
        const rhymeValue = Object.getPrototypeOf(this).constructor.getRhymeStrength(
          word,
          actualWord
        );
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

      const objKeys = Object.keys(node.children);
      for (let i = 0; i < objKeys.length; i += 1) {
        const char = objKeys[i];
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

export class VowelRhymeStrategy extends SuffixTrieStrategy {
  getRhymeStrength: (word: string, matchingWord: string) => number;

  static getRhymeStrength(str1: string, str2: string): number {
    const vowels = 'АЕИОУаеиоу';

    // Helper function to get vowels from a word
    const extractVowels = (s: string) => s.split('').filter((char) => vowels.includes(char));

    const vowels1 = extractVowels(str1);
    const vowels2 = extractVowels(str2);

    // Start from the last vowel and compare
    let count = 0;
    let i = vowels1.length - 1;
    let j = vowels2.length - 1;

    while (i >= 0 && j >= 0 && vowels1[i] === vowels2[j]) {
      count += 1;
      i -= 1;
      j -= 1;
    }

    // If the last vowels don't match, return 0
    if (i !== vowels1.length - 1 || j !== vowels2.length - 1) {
      return count === 0 ? 0 : count - 1;
    }

    return count;
  }
}

export class ImperfectRhymeStrategy extends SuffixTrieStrategy {
  getRhymeStrength: (word: string, matchingWord: string) => number;

  static getRhymeStrength(str1: string, str2: string): number {
    const vowels = 'АЕИОУаеиоу';

    const extractVowels = (s: string) => s.split('').filter((char) => vowels.includes(char));

    const vowels1 = extractVowels(str1);
    const vowels2 = extractVowels(str2);

    // Start from the last vowel and compare
    let count = 0;
    let i = vowels1.length - 1;
    let j = vowels2.length - 1;

    while (i >= 0 && j >= 0 && vowels1[i] === vowels2[j]) {
      count += 1;
      i -= 1;
      j -= 1;
    }

    const lastLetterEQ = str1[str1.length - 1] === str2[str2.length - 1];
    if (!lastLetterEQ) {
      return 0;
    }

    // If the last two letters match unless the one of the words has one letter, return count
    if (str1.length > 1 && str2.length > 1) {
      const secondToLastLetterEQ = str1[str1.length - 2] === str2[str2.length - 2];

      if (!secondToLastLetterEQ) {
        return 0;
      }
    }

    // If the last vowels don't match, return 0
    if (i !== vowels1.length - 1 || j !== vowels2.length - 1) {
      return count === 0 ? 0 : count - 1;
    }

    return count;
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

  getStrategy() {
    return this.strategy;
  }

  findRhymes(word: string): Rhyme[] {
    return this.strategy.findRhymes(word);
  }
}
