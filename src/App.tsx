import { useEffect, useState } from "react";
import { useDocument, type UrlHeads } from "@automerge/react";
import { useRootDocumentHandle } from "./useRootDocument";
import { Canvas } from "./Canvas";
import type { DocumentData } from "./document-data";

import "./App.css";

function arePositionsEqual(position1?: [number, number], position2?: [number, number]): boolean {
  return position1?.[0] === position2?.[0] && position1?.[1] === position2?.[1];
}

interface Sample {
  id: number;
  heads: UrlHeads;
  data: DocumentData;
}

function App() {
  const handle = useRootDocumentHandle();
  const [doc, change] = useDocument<DocumentData>(handle?.documentId);

  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);

  const isReadonly = !!selectedSample;
  const viewHandle = isReadonly && handle ? handle.view(selectedSample.heads) : undefined;
  const viewDoc = viewHandle ? viewHandle.doc() : undefined;

  const position: [number, number] | undefined = isReadonly
    ? viewDoc?.properties.position
    : doc?.properties.position;

  useEffect(() => {
    console.group("Positions");
    console.log("Document:", doc?.properties.position);
    console.log("View:", viewDoc?.properties.position);
    console.groupEnd();
  }, [isReadonly, doc, viewDoc]);

  const handlePositionChange = (position: [number, number]) => {
    change((doc) => {
      doc.updatedAt = new Date().toISOString();
      doc.properties.position = position;
    });
  };

  const takeSample = () => {
    if (!doc || !handle) return;

    const sample: Sample = {
      id: Date.now(),
      heads: handle.heads(),
      data: doc,
    };

    setSamples((samples) => [sample, ...samples]);
  };

  const selectSample = (sample: Sample) => {
    setSelectedSample(sample);
  };

  const deselectSample = () => {
    setSelectedSample(null);
  };

  const clearSamples = () => {
    setSamples([]);
    setSelectedSample(null);
  };

  return (
    <>
      <main>
        <header>
          <div className="position-info">
            {isReadonly && (
              <>
                <span>
                  Expected Position: [{selectedSample.data.properties.position[0]},{" "}
                  {selectedSample.data.properties.position[1]}],
                </span>

                <span>
                  Actual Position:{" "}
                  {position ? `[${position[0]}, ${position[1]}]` : String(position)},
                </span>

                <span>
                  Positions are{" "}
                  {arePositionsEqual(position, selectedSample.data.properties.position) ? (
                    <span className="equal">Equal</span>
                  ) : (
                    <span className="not-equal">Not Equal</span>
                  )}
                </span>
              </>
            )}
          </div>
          <button onClick={takeSample}>Take Sample</button>
        </header>

        <Canvas readonly={isReadonly} position={position} onPositionChange={handlePositionChange} />
      </main>

      <aside>
        <div className="samples-header">
          <h3>Samples</h3>
          <button onClick={clearSamples}>Clear Samples</button>
        </div>

        <ul className="samples-list">
          {samples.map((sample) => (
            <li
              key={sample.id}
              className={`sample-item${sample.id === selectedSample?.id ? " selected" : ""}`}
            >
              <div className="sample-info">
                <span className="sample-position">
                  Position: [{sample.data.properties.position[0]},{" "}
                  {sample.data.properties.position[1]}]
                </span>
                <br />
                <span className="sample-id">ID: {sample.id.toString().slice(-6)}</span>
                <br />
                <span className="sample-timestamp">
                  Updated at: {new Date(sample.data.updatedAt).toLocaleString()}
                </span>
              </div>

              <div className="sample-actions">
                {selectedSample?.id === sample.id ? (
                  <button onClick={() => deselectSample()}>Deselect</button>
                ) : (
                  <button onClick={() => selectSample(sample)}>Select</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

export default App;
