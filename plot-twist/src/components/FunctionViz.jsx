import { Mafs, Coordinates, Plot, Point, Line, Text, Theme } from "mafs";
import "mafs/core.css";

export default function FunctionViz({ config, setVizConfig }) {
  
  // --- 1. ROBUST FUNCTION PARSER ---
  // Converts user strings like "Sine of x" into actual JS functions
  const getFunction = (funcName) => {
    // Normalize string: remove spaces, make lowercase to be safe
    const cleanName = funcName?.toLowerCase().replace(/\s/g, "") || "x^2";

    if (cleanName.includes("sin")) return (x) => Math.sin(x);
    if (cleanName.includes("cos")) return (x) => Math.cos(x);
    if (cleanName.includes("tan")) return (x) => Math.tan(x);
    if (cleanName.includes("cube") || cleanName.includes("x^3")) return (x) => x * x * x;
    if (cleanName.includes("sq") || cleanName.includes("x^2")) return (x) => x * x;
    
    // Default fallback: Linear line y = x
    return (x) => x;
  };

  const f = getFunction(config.func);
  
  // Ensure xPoint exists (default to 1.0 if missing)
  const x = config.xPoint !== undefined ? config.xPoint : 1; 
  const y = f(x);

  // --- 2. CALCULATE DERIVATIVE (SLOPE) ---
  // We use a numerical approximation (finite difference method)
  // Slope = ( f(x + small_step) - f(x) ) / small_step
  const h = 0.001;
  const slope = (f(x + h) - f(x)) / h;

  return (
    <div className="h-full w-full bg-[#111]">
      <Mafs
        // We set a viewbox that works well for both Trig (small Y) and Parabolas (large Y)
        viewBox={{ x: [-6, 6], y: [-4, 4] }} 
        preserveAspectRatio={false}
        pan={true}
        zoom={true}
      >
        {/* The Grid */}
        <Coordinates.Cartesian subdivisions={2} />

        {/* 3. PLOT THE MAIN CURVE */}
        <Plot.OfX 
            y={f} 
            color={Theme.blue} 
            weight={3} 
        />

        {/* 4. THE TANGENT LINE (The Derivative) */}
        <Line.PointSlope 
            point={[x, y]} 
            slope={slope} 
            color="#fcc419" 
            weight={2} 
            opacity={0.8} 
        />

        {/* 5. DRAGGABLE INTERACTIVE POINT */}
        <Point
          x={x}
          y={y}
          color="#fcc419"
          // Crucial: This updates the App state when you drag
          onMove={(point) => {
            setVizConfig({ ...config, xPoint: point[0] });
          }}
        />

        {/* 6. LIVE LABELS */}
        
        {/* Floating Function Label (Top Left) */}
        <Text x={-5.5} y={3.5} className="text-white text-xl font-mono font-bold">
          f(x) = {config.func || "x^2"}
        </Text>

        {/* Live Data next to the point */}
        <Text x={x + 0.5} y={y + 0.5} className="text-[#fcc419] text-sm font-mono">
          {`Slope: ${slope.toFixed(2)}`}
        </Text>
        
        <Text x={x + 0.5} y={y + 0.2} className="text-gray-400 text-xs font-mono">
          {`x: ${x.toFixed(2)}`}
        </Text>

      </Mafs>
    </div>
  );
}