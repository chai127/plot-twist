import { Mafs, Coordinates, Vector } from "mafs";
import "mafs/core.css";

export default function VectorAdditionViz({ config }) {
  const { a, b } = config.vectors;
  const c = [a[0] + b[0], a[1] + b[1]];

  return (
    <div className="h-full w-full">
      <Mafs 
        viewBox={{ x: [-1, 8], y: [-1, 8] }} 
        preserveAspectRatio={false}
        pan={true} // Allow dragging the canvas
        zoom={true} // Allow zooming
      >
        <Coordinates.Cartesian subdivisions={2} />
        
        {/* Vector A (Yellow) */}
        <Vector tail={[0, 0]} tip={a} color="#fcc419" weight={3} />
        
        {/* Vector B (Blue) */}
        <Vector tail={[0, 0]} tip={b} color="#74c0fc" weight={3} />
        
        {/* Ghost Vectors showing the path */}
        {config.showSteps && (
          <>
            <Vector tail={a} tip={c} color="#74c0fc" opacity={0.3} weight={2} style="dashed" />
            <Vector tail={b} tip={c} color="#fcc419" opacity={0.3} weight={2} style="dashed" />
          </>
        )}
        
        {/* Result Vector C (Red) */}
        <Vector tail={[0, 0]} tip={c} color="#ff6b6b" weight={4} />
      </Mafs>
    </div>
  );
}