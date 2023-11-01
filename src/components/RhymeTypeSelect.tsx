import { ChangeEventHandler } from 'react';

export default function RhymeTypeSelect({ rhymeType, setRhymeType, setRhymeStrategy }) {
  const handleRadioChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRhymeType(e.target.value);
    setRhymeStrategy(e.target.value);
  };

  return (
    <div>
      <span>Rhyme type:</span>
      <label htmlFor="perfect">
        <input
          type="radio"
          id="perfect"
          name="rhyme-type"
          value="perfect"
          checked={rhymeType === 'perfect'}
          onChange={handleRadioChange}
        />
        Perfect Rhyme
      </label>
      <label htmlFor="imperfect">
        <input
          type="radio"
          id="imperfect"
          name="rhyme-type"
          value="imperfect"
          checked={rhymeType === 'imperfect'}
          onChange={handleRadioChange}
        />
        Imperfect Rhyme
      </label>
      <label htmlFor="vowel">
        <input
          type="radio"
          id="vowel"
          name="rhyme-type"
          value="vowel"
          checked={rhymeType === 'vowel'}
          onChange={handleRadioChange}
        />
        Vowel Rhyme
      </label>
    </div>
  );
}
