import { useRef } from "react";

const BLOCK_WIDTH = 80;
const BLOCK_HEIGHT = 80;

export interface CanvasProps {
  readonly?: boolean;
  position?: [number, number];
  onPositionChange?: (position: [number, number]) => void;
}

export function Canvas({ readonly, position, onPositionChange }: CanvasProps) {
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = canvasRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 };
  const centerPosition: [number, number] = [
    width / 2 - BLOCK_WIDTH / 2,
    height / 2 - BLOCK_HEIGHT / 2,
  ];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || !position || !canvasRef.current) return;

    isDragging.current = true;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    // Calculate offset between mouse position (in canvas coordinates) and block position
    dragOffset.current = {
      x: e.clientX - canvasRect.left - position[0],
      y: e.clientY - canvasRect.top - position[1],
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || !position || !canvasRef.current || !isDragging.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    let newX = e.clientX - canvasRect.left - dragOffset.current.x;
    let newY = e.clientY - canvasRect.top - dragOffset.current.y;

    // Constrain position within canvas boundaries
    newX = Math.max(0, Math.min(newX, canvasRect.width - BLOCK_WIDTH));
    newY = Math.max(0, Math.min(newY, canvasRect.height - BLOCK_HEIGHT));

    onPositionChange?.([newX, newY]);
  };

  const handleMouseUp = () => {
    if (readonly || !position) return;

    isDragging.current = false;
  };

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className={`block${readonly ? " locked" : ""}`}
        style={{
          left: `${position?.[0] ?? centerPosition[0]}px`,
          top: `${position?.[1] ?? centerPosition[1]}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        {position ? `${Math.round(position[0])}, ${Math.round(position[1])}` : "N/A"}
      </div>
    </div>
  );
}
