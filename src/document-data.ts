export interface DocumentData {
  name: string;
  createdAt: string;
  updatedAt: string;
  properties: {
    position: [number, number];
  };
}
