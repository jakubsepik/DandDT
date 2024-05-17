/*
 function calculateStatBonus(stat) {
    return Math.floor((stat - 10) / 2);
  }

  function calculateProficiencyBonus(level) {
    return Math.floor((level - 1) / 4) + 2;
  }

  function savingThrow(stat) {
    if (props.proficienciesSavingThrows.includes(stat))
      return <div className="underline" title="Saving throw proficiency">{stat}</div>;
    return <div>{stat}</div>;
  }

  
<div className="grid grid-cols-6 gap-2 mt-4 text-center">
          {savingThrow("STR")}
          {savingThrow("DEX")}
          {savingThrow("CON")}
          {savingThrow("INT")}
          {savingThrow("WIS")}
          {savingThrow("CHA")}
          <div>{STR}</div>
          <div>{DEX}</div>
          <div>{CON}</div>
          <div>{INT}</div>
          <div>{WIS}</div>
          <div>{CHA}</div>
        </div>

        <div className="flex flex-row space-x-3 mt-4">
          <div className="border-r-2 border-r-secondary">
            {proficienciesSkills.map((skill) => {
              return <div>{skill} +{calculateProficiencyBonus(level)}</div>;
            })}
          </div>
          <div>
            {proficienciesOther.map((other) => {
              return <div>{other}</div>;
            })}
          </div>
        </div>*/