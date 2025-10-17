import type { DocumentId } from "@automerge/automerge-repo";
import { useDocHandle } from "@automerge/react";
import { useCallback, useEffect, useState } from "react";
import { repository } from "./repository";
import type { DocumentData } from "./document-data";

/**
 * Returns the root document id from local storage.
 * If no root document id is found, it creates a new root document and stores the id in local storage.
 *
 * @returns The root document id.
 */
export function useRootDocumentId(): DocumentId | null {
  const [rootDocumentId, setRootDocumentId] = useState<DocumentId | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createRootDocument = useCallback(async () => {
    setIsCreating(true);

    const handle = repository.create<DocumentData>({
      name: "App 1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      properties: {
        position: [100, 100],
      },
    });

    setRootDocumentId(handle.documentId);
    setIsCreating(false);
  }, [setRootDocumentId]);

  useEffect(() => {
    if (!rootDocumentId && !isCreating) {
      createRootDocument();
    }
  }, [rootDocumentId, createRootDocument, isCreating]);

  return rootDocumentId;
}

export function useRootDocumentHandle() {
  const rootDocumentId = useRootDocumentId();

  return useDocHandle<DocumentData>(rootDocumentId ?? undefined);
}
