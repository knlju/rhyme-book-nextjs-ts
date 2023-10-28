import SuffixTrie from "@/utils/suffixTrie";
import {RhymeFinder, SuffixTrieStrategy} from "@/utils/rhymeFinder";
import {useEffect, useState} from "react";


export default function useGetTrie() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [trie, setTrie] = useState<SuffixTrie>();
  const [rhymeFinder, setRhymeFinder] = useState<RhymeFinder>();

  useEffect(() => {
    async function fetchWordTxt() {
      try {
        setError(null)
        setLoading(true)
        const response = await fetch('/sr.dic.txt');
        const data = await response.text();
        const newTrie = new SuffixTrie();
        const words = data.split('\n');
        for (let word of words) {
          newTrie.insert(word);
        }

        setTrie(newTrie);

        setRhymeFinder(new RhymeFinder(new SuffixTrieStrategy(newTrie)));

      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchWordTxt()
  }, [])

  return {trie, rhymeFinder, error, loading}
}

