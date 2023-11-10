import { ChangeEventHandler } from 'react';

export type SerbianScript = 'cyrillic' | 'latin';
type Props = { script: SerbianScript; handleScriptChange: ChangeEventHandler<HTMLSelectElement> };
export default function ScriptSelect({ script, handleScriptChange }: Props) {
  return (
    <section>
      <span>Select script</span>
      <select
        className="select-style"
        id="script-select"
        name="script-select"
        value={script}
        onChange={handleScriptChange}>
        <option value="cyrillic">Cyrillic</option>
        <option value="latin">Latin</option>
      </select>
    </section>
  );
}
