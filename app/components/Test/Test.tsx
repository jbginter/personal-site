"use client";
import { useState, useEffect } from "react";
import { useKeyboardShortcut } from "@/app/hooks/useKeyboardShortcut";

interface checkValues {
  currentValues: string[],
  newestCombo: string[],
};

export default function Test() {
  
  const [combo, setCombo] = useState<string[]>([]);
  const finalCombo = ['a', 's', 'd', 'f'];

  useKeyboardShortcut("a", () => {
    setCombo([...combo, "a"]);
    console.log('hook', combo);
    checkValuesFunc({ currentValues: finalCombo, newestCombo: [...combo, "a"] });
  });

  useEffect(() => {
    //checkValuesFunc({ currentValues: finalCombo, newestCombo: combo });
  }, [combo]);

  const checkValuesFunc = ({currentValues, newestCombo}: checkValues) => {
    for (let i = 0; i <= currentValues.length; i++) {
      if (currentValues[i].toString() === newestCombo[i].toString()) {
        if (currentValues.length === newestCombo.length) {
          // do something special
          console.log('equals reset');
          setCombo.length ? setCombo([]) : null;
          return true;
        }
        console.log('adding on', currentValues, newestCombo);
        return true;
      }
      console.log('did not equal combo, reseting...');
      setCombo.length ? setCombo([]) : null;
      return false;
    };
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">

    </div>
  );
}
