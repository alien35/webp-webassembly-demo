import React, { useState, useEffect, useRef } from "react";
import createModule from "./webp.mjs";

function App() {

  const [assemblyApi, setAssemblyApi] = useState();

  const imgRef = useRef();

  const loadImage = async (src) => {
    // Load image
    const imgBlob = await fetch(src).then(resp => resp.blob());
    const img = await createImageBitmap(imgBlob);
    // Make canvas same size as image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw image onto canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  }

  useEffect(
    () => {
    createModule().then(async (Module) => {
      const api = {
        version: Module.cwrap("version", "number", []),
        create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
        destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
        encode: Module.cwrap("encode", "", ["number", "number", "number", "number"]),
        get_result_pointer: Module.cwrap("get_result_pointer", "number", []),
        get_result_size: Module.cwrap("get_result_size", "number", []),
        free_result: Module.cwrap("free_result", "", ["number"])
      }
      setAssemblyApi(() => api);
      const image = await loadImage(process.env.PUBLIC_URL + '/logo512.png');
      const p = api.create_buffer(image.width, image.height);
      Module.HEAP8.set(image.data, p);
      api.encode(p, image.width, image.height, 100);
      const resultPointer = api.get_result_pointer();
      const resultSize = api.get_result_size();
      const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);
      api.free_result(resultPointer);
      api.destroy_buffer(p);

      const blob = new Blob([resultView], {type: 'image/webp'});
      const blobURL = URL.createObjectURL(blob);
      imgRef.current.src = blobURL;
    });
  }, []);

  if (!assemblyApi) {
    return "Loading webassembly...";
  }

  return (
    <div className="App">
      <p>version: {assemblyApi.version()}</p>
      <p>Our webP image below:</p>
      <img ref={imgRef} />
    </div>
  );
}

export default App;