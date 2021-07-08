import React, { useState, useEffect } from "react";
import createModule from "./webp.mjs";

function App() {

  const [version, setVersion] = useState();
  useEffect(
    () => {
    createModule().then((Module) => {
      setVersion(() => Module.cwrap("version", "number", []));
    });
  }, []);

  if (!version) {
    return "Loading webassembly...";
  }

  return (
    <div className="App">
      <p>version: {version()}</p>
    </div>
  );
}

export default App;