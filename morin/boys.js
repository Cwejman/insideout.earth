import * as THREE from 'three';

const { sqrt, cos, sin, PI } = Math;

const boysSurface = (u, v) => {
  const D = 2 - sqrt(2) * sin(3 * u) * sin(2 * v);

  return [
    (sqrt(2) * cos(2 * u) * cos(v) ** 2 + cos(u) * sin(2 * v)) / D,
    (sqrt(2) * sin(2 * u) * cos(v) ** 2 - sin(u) * sin(2 * v)) / D,
    (3 * cos(v) ** 2) / D,
  ];
}

export function createMesh ({
                              uSteps = 20,
                              vSteps = 30,
                              uMin = 0.001,
                              uMax = Math.PI/3 * 2,
                              vMin = 0.001,
                              vMax = Math.PI/3 * 2,
                              params,
  loop1s
                            } = {}) {
  const loops = [];
  for (let j = 0; j <= vSteps; j++) {
    const v = vMin + (vMax - vMin) * (j / vSteps);

    const loop = []
    for (let i = 0; i <= uSteps; i++) {
      const u = uMin + (uMax - uMin) * (i / uSteps);
      loop.push(boysSurface(u, v));
    }

    loops.push(loop);
  }

  const indices = [];
  const rowLen = uSteps + 1;
  for (let j = 0; j < vSteps; j++) {
    for (let i = 0; i < uSteps; i++) {
      const a = i + j * rowLen;
      const b = a + 1;
      const c = a + rowLen;
      const d = c + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const group = new THREE.Group();

  console.log(loop1s)

  const point = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...boysSurface(loop1s, params.v))]),
    new THREE.PointsMaterial({
      color: new THREE.Color().setHSL(params.v / PI || 0, 1, 0.5),
      size: 0.1
    }),
  );

  group.add(point)

  loops.forEach((loop, i) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      loop.map(pos => new THREE.Vector3(...pos)),
    );

    const color = new THREE.Color().setHSL(i / (loops.length - 1), 1, 0.5);
    const material = new THREE.LineBasicMaterial({ color });
    const line = new THREE.Line(geometry, material);
    group.add(line);
  });

  return group;
}

export const createMeshFromBuffers = (positions, indices) => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const color = new THREE.Color().setHSL(60, 60, 60);

  const material = new THREE.MeshStandardMaterial({
    color: color,
    flatShading: false,
    side: THREE.DoubleSide,
    wireframe: true
  });

  return new THREE.Mesh(geometry, material);
}