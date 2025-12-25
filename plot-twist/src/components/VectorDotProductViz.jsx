import { Mafs, Coordinates, Vector, Line, Point, Text, Theme } from "mafs";
import "mafs/core.css";

export default function VectorDotProductViz({ config }) {
  const { a, b } = config.vectors;
  
  // --- MATH LOGIC ---
  // 1. Calculate Dot Product: (ax * bx) + (ay * by)
  const dotProduct = (a[0] * b[0]) + (a[1] * b[1]);

  // 2. Calculate Projection of B onto A (The "Shadow")
  // Formula: proj = ( (a . b) / |a|^2 ) * a
  const magASq = a[0] ** 2 + a[1] ** 2;
  const scaleFactor = magASq === 0 ? 0 : dotProduct / magASq;
  
  const projX = scaleFactor * a[0];
  const projY = scaleFactor * a[1];
  const projection = [projX, projY];

  return (
    <div className="h-full w-full">
      <Mafs
        viewBox={{ x: [-2, 8], y: [-2, 8] }}
        preserveAspectRatio={false}
        pan={true}
        zoom={true}
      >
        <Coordinates.Cartesian subdivisions={2} />

        {/* Vector A (Base) - Yellow */}
        <Vector tail={[0, 0]} tip={a} color="#fcc419" weight={4} />
        <Text x={a[0]} y={a[1]} attach="ne" className="text-yellow-400 font-bold">A</Text>

        {/* Vector B (Projector) - Blue */}
        <Vector tail={[0, 0]} tip={b} color="#74c0fc" weight={4} />
        <Text x={b[0]} y={b[1]} attach="ne" className="text-blue-400 font-bold">B</Text>

        {/* The Projection Line (Dropping the perpendicular) */}
        {config.showSteps && (
          <>
            {/* Dashed line from Tip of B to the Projection point on A */}
            <Line.Segment
              point1={b}
              point2={projection}
              style="dashed"
              opacity={0.5}
              color="white"
            />
            
            {/* The "Shadow" Vector (Projection) - Red */}
            <Vector 
                tail={[0, 0]} 
                tip={projection} 
                color="#ff6b6b" 
                weight={3} 
                opacity={0.8}
            />
             <Text x={projX / 2} y={projY / 2} attach="se" className="text-red-400 text-xs">
              Projection
            </Text>
          </>
        )}
        
        {/* Live Result Label pinned to the canvas */}
        <Text x={0.5} y={-1} className="text-white text-lg font-mono">
            {`Dot Product: ${dotProduct.toFixed(2)}`}
        </Text>
      </Mafs>
    </div>
  );
}