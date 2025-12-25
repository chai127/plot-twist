import { Mafs, Coordinates, Vector } from "mafs"
import "mafs/core.css"

export default function VectorAdditionViz({ config }) {
  const { a, b } = config.vectors
  const c = [a[0] + b[0], a[1] + b[1]]

  return (
    <div className="h-full w-full min-h-[300px]">
      <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }}>
        <Coordinates.Cartesian subdivisions={2} />
        <Vector tail={[0, 0]} tip={a} color="#fcc419" weight={3} />
        <Vector tail={[0, 0]} tip={b} color="#74c0fc" weight={3} />
        {config.showSteps && (
          <>
            <Vector tail={a} tip={c} color="#74c0fc" opacity={0.35} weight={2} />
            <Vector tail={b} tip={c} color="#fcc419" opacity={0.35} weight={2} />
          </>
        )}
        <Vector tail={[0, 0]} tip={c} color="#ff6b6b" weight={4} />
      </Mafs>
    </div>
  )
}
