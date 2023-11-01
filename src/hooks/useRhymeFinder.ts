import SuffixTrie from '@utils/suffixTrie';
import {
  ImperfectRhymeStrategy,
  RhymeFinder,
  SuffixTrieStrategy,
  VowelRhymeStrategy
} from '@utils/rhymeFinder';
import { useEffect, useState } from 'react';

export type RhymeType = 'vowel' | 'imperfect' | 'perfect';

interface Options {
  strategyType: RhymeType;
}

export default function useRhymeFinder(options: Options) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [trie, setTrie] = useState<SuffixTrie>();
  const [rhymeFinder, setRhymeFinder] = useState<RhymeFinder>();

  useEffect(() => {
    async function fetchWordTxt() {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch('/sr.dic.txt');
        const data = await response.text();
        const newTrie = new SuffixTrie();
        const words = data.split('\n');
        for (let i = 0; i < words.length; i += 1) {
          const word = words[i];
          newTrie.insert(word);
        }

        setTrie(newTrie);

        setRhymeFinder(new RhymeFinder(new ImperfectRhymeStrategy(newTrie)));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchWordTxt();
  }, []);

  return { trie, rhymeFinder, error, loading };
}
