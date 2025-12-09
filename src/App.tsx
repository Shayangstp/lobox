import { useState } from "react";
import { MultiSelect, type MultiSelectOption } from "./components/base/multiSelect/MultiSelect";
import "./App.scss";

const scienceOptions: MultiSelectOption[] = [
  { value: "education", label: "Education", icon: "🎓" },
  { value: "science", label: "Yeeeah, science!", group: "Education", icon: "🧪" },
  { value: "art", label: "Art", icon: "🎨" },
  { value: "sport", label: "Sport", icon: "⚽" },
  { value: "games", label: "Games", icon: "🎮" },
  { value: "health", label: "Health", icon: "🩺" },
];

function App() {
  const [value, setValue] = useState<MultiSelectOption[]>([]);

  return (
    <div className="app">
      <MultiSelect
        options={scienceOptions}
        value={value}
        onChange={setValue}
        placeholder="Science"
      />
    </div>
  );
}

export default App;
