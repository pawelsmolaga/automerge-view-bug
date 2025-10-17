# Automerge Document View bug

This playground demonstrates an issue with Automerge document views. The application stores a draggable box's position in an Automerge CRDT document.

**How positions are saved:**

- The document structure contains a `properties.position` field that stores coordinates as a tuple `[x, y]`
- When the user drags the box, the app calls `handle.change()` to update the position in the Automerge document
- The position is persisted through Automerge's `@automerge/automerge-repo` with IndexedDB storage

**What samples do:**

- Samples are snapshots that capture the document state at a specific moment in time
- Each sample stores:
  - The document's `heads` (Automerge commit hashes representing that point in the document's history)
  - A copy of the document data (including the position at that time)
  - A timestamp and unique ID
- Samples are stored in browser localStorage for persistence across page reloads
- When a sample is selected, the app uses `handle.view(selectedSample.heads)` to create a read-only view of the document at that historical state
- The view should return the document as it existed at that point, with all properties intact

The bug occurs when viewing older samples: while the latest sample correctly returns the position from the view, older samples return `undefined` for `viewDoc.properties.position`, even though the position was saved in the sample data.

## Reproduction Steps

1. Run playground with `pnpm dev`
2. Open it in browser `http://localhost:5173/`
3. Grab the box and move it around
4. Click "Take Sample"
5. ... repeat steps 3 and 4 few times
6. Select the latest sample. The position saved in the sample should match the one returned from the view.
7. Select an older sample; the position returned from the view will be `undefined`.
