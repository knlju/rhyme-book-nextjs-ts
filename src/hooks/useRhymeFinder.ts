import SuffixTrie from '@utils/suffixTrie';
import {
  ImperfectRhymeStrategy,
  RhymeFinder,
  RhymeFindingStrategy,
  SuffixTrieStrategy as PerfectRhymeStrategy,
  VowelRhymeStrategy
} from '@utils/rhymeFinder';
import { useEffect, useState } from 'react';
import { SerbianScript } from '@components/ScriptSelect';

export type RhymeType = 'vowel' | 'imperfect' | 'perfect';

interface Options {
  strategyType: RhymeType;
}

function getRhymeStrategy(options: Options, trie: SuffixTrie): RhymeFindingStrategy {
  switch (options.strategyType) {
    case 'vowel':
      return new VowelRhymeStrategy(trie);
    case 'imperfect':
      return new ImperfectRhymeStrategy(trie);
    case 'perfect':
      return new PerfectRhymeStrategy(trie);
    default:
      return new PerfectRhymeStrategy(trie);
  }
}

export default function useRhymeFinder(options: Options) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [trie, setTrie] = useState<SuffixTrie>();
  const [rhymeFinder, setRhymeFinder] = useState<RhymeFinder>();

  function setRhymeStrategy() {
    rhymeFinder.setStrategy(getRhymeStrategy(options, trie));
  }

  useEffect(() => {
    if (loading || !trie || !rhymeFinder) return;
    setRhymeStrategy();
  }, [options]);

  function fetchAndBuildTrie(script: SerbianScript) {
    async function fetchWordTxt() {
      try {
        setError(null);
        setLoading(true);
        const file =
          script === 'latin'
            ? 'https://raw.githubusercontent.com/turanjanin/spisak-srpskih-reci/master/serbian-words-latin.txt'
            : '/sr.dic.txt';
        const response = await fetch(file);
        const data = await response.text();
        const newTrie = new SuffixTrie();
        const words = data.split('\n');
        for (let i = 0; i < words.length; i += 1) {
          const word = words[i];
          newTrie.insert(word);
        }

        setTrie(newTrie);

        const strategy = getRhymeStrategy(options, newTrie);

        const newRhymeFinder = new RhymeFinder(strategy);

        setRhymeFinder(newRhymeFinder);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchWordTxt();
  }

  useEffect(() => {
    fetchAndBuildTrie('cyrillic');
  }, []);

  return { trie, rhymeFinder, error, loading, setRhymeStrategy, fetchAndBuildTrie };
}
