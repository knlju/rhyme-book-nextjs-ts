import {useState, useEffect} from 'react';
import SuffixTrie from '@/utils/suffixTrie';
import {RhymeFinder, SuffixTrieStrategy} from "@/utils/rhymeFinder";

// @TODO: add selection of different strategies for rhyme finding
export default function Home() {
  const [loadingFile, setLoadingFile] = useState(true);
  const [buildingTrie, setBuildingTrie] = useState(false);
  const [trieBuilt, setTrieBuilt] = useState(false);
  const [trie, setTrie] = useState<SuffixTrie>(null);
  const [inputWord, setInputWord] = useState('');
  const [matches, setMatches] = useState([]);
  const [rhymeFinder, setRhymeFinder] = useState<RhymeFinder>(null);

  useEffect(() => {
    async function fetchDataAndBuildTrie() {
      try {
        const response = await fetch('/sr.dic.txt');
        const data = await response.text();

        setLoadingFile(false);
        setBuildingTrie(true);

        const newTrie = new SuffixTrie();
        const words = data.split('\n');
        for (let word of words) {
          newTrie.insert(word);
        }

        setTrie(newTrie);

        setRhymeFinder(new RhymeFinder(new SuffixTrieStrategy(newTrie)));

        setBuildingTrie(false);
        setTrieBuilt(true);

      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    }

    fetchDataAndBuildTrie();
  }, []);

  const handleInputChange = (e) => {
    setInputWord(e.target.value);
  }

  const findMatches = () => {
    if (!trie || !inputWord) return;

    const matches = rhymeFinder.findRhymes(inputWord)

    setMatches(matches);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    findMatches()
  }


  return (
    <>
      {loadingFile && <p>Loading file...</p>}
      {buildingTrie && <p>Building suffix trie...</p>}
      {trieBuilt && (
        <>
          <p>Suffix Trie built successfully!</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputWord}
              onChange={handleInputChange}
              placeholder="Enter a word..."
            />
            <button onClick={findMatches}>Find Rhymes</button>
          </form>
          <ul>
            {matches.map(match => <li key={match.rhyme}>{match.rhymeLength}: {match.rhyme}</li>)}
          </ul>
        </>
      )}
    </>
  );
}
