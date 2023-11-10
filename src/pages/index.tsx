import { useState, type ChangeEvent, type FormEvent, ChangeEventHandler } from 'react';
import { type Rhyme } from '@utils/rhymeFinder';
import useRhymeFinder, { RhymeType } from '@hooks/useRhymeFinder';
import RhymeTypeSelect from '@components/RhymeTypeSelect';
import ScriptSelect, { SerbianScript } from '@components/ScriptSelect';

function Home() {
  const [inputWord, setInputWord] = useState('');
  const [rhymeType, setRhymeType] = useState<RhymeType>('perfect');
  const [matches, setMatches] = useState<Rhyme[]>([]);
  const [script, setScript] = useState<SerbianScript>('cyrillic');

  const { error, trie, loading, rhymeFinder, setRhymeStrategy, fetchAndBuildTrie } = useRhymeFinder(
    {
      strategyType: rhymeType
    }
  );

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

  const handleScriptChange: ChangeEventHandler<HTMLSelectElement> = async (event) => {
    const newScript = event.target.value;
    if (newScript !== 'cyrillic' && newScript !== 'latin') return;
    setScript(newScript);
    if (newScript !== script) {
      fetchAndBuildTrie(newScript);
    }
  };

  return (
    <>
      <h1>Rhyme Book</h1>
      {error && <div>{error.message}</div>}
      {loading && <p>Loading file...</p>}
      {!loading && (
        <>
          <ScriptSelect script={script} handleScriptChange={handleScriptChange} />
          <RhymeTypeSelect
            rhymeType={rhymeType}
            setRhymeType={setRhymeType}
            setRhymeStrategy={setRhymeStrategy}
          />
        </>
      )}
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
