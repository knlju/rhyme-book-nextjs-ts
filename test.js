const fs = require('fs');
const path = require('path');

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class SuffixTrie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  buildFromWord(word) {
    for (let i = 0; i < word.length; i++) {
      this.insert(word.slice(i));
    }
  }
}

function buildSuffixTrieFromWords(words) {
  const trie = new SuffixTrie();
  for (let word of words) {
    trie.buildFromWord(word);
  }
  return trie;
}

// Helper function to check if a character is a vowel
function isVowel(char) {
  return ['а', "е", "и", 'о', 'у', 'А', 'Е', 'И', 'О', "У"].includes(char);  // Add additional vowels if needed for Serbian
}

function rhymeCount(inputWord, word) {
  let count = 0;
  for (let i = 1; i <= Math.min(inputWord.length, word.length); i++) {
    if (inputWord[inputWord.length - i] === word[word.length - i]) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

// Helper function to filter rhymes based on the criteria of having at least one vowel
function filterRhymes(word, count) {
  for (let i = 1; i <= count; i++) {
    if (isVowel(word[word.length - i])) {
      return true;
    }
  }
  return false;
}

// Read the file and find rhymes
function findRhymesFor(inputWord) {
  fs.readFile(path.join(__dirname, '/public/sr.dic.txt'), 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const words = data.split('\n');
    const rhymes = words.map(word => ({
      word: word,
      count: rhymeCount(inputWord, word)
    })).filter(r => filterRhymes(r.word, r.count)).sort((a, b) => b.count - a.count);

    // Limit to top 100
    const top100Rhymes = rhymes.slice(0, 100);

    for (let rhyme of top100Rhymes) {
      console.log(rhyme.word);
    }
  });
}

// Test the function with an input word
findRhymesFor("тест");
