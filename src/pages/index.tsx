import { useState, type ChangeEvent, type FormEvent } from 'react';
import { type Rhyme } from '@utils/rhymeFinder';
import useGetTrie from '@hooks/useGetTrie';

// @TODO: add selection of different strategies for rhyme finding
function Home() {
  const [inputWord, setInputWord] = useState('');
  const [matches, setMatches] = useState<Rhyme[]>([]);

  const { error, trie, loading, rhymeFinder } = useGetTrie();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputWord(e.target.value);
  };

  const findMatches = () => {
    if (!trie || !inputWord || !rhymeFinder) return;

    const rhymesFound = rhymeFinder.findRhymes(inputWord);

    setMatches(rhymesFound);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    findMatches();
  };

  return (
    <>
      {error && <div>{error.message}</div>}
      {loading && <p>Loading file...</p>}
      {trie && (
        <>
          <p>Suffix Trie built successfully!</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputWord}
              onChange={handleInputChange}
              placeholder="Enter a word..."
            />
            <button onClick={findMatches} type="submit">
              Find Rhymes
            </button>
          </form>
          <ul>
            {matches.map((match) => (
              <li key={match.rhyme}>
                {match.rhymeLength}: {match.rhyme}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
export default Home;
