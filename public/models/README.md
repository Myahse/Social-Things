# 3D logo model (optional)

The intro uses the bundled GLB in `src/assets/3d model.glb`.

To replace it, update `src/features/intro/config/logoModel.ts` with your new import.

You can also place an alternate file here as **`logo.glb`** for experiments.

## How to create a 3D logo

1. **Blender** (free): Import your SVG or PNG → extrude / solidify → Export → glTF 2.0 (`.glb`).
2. **Spline** (spline.design): Design in 3D → Export → GLB.
3. **Vectary / Cinema 4D / Fusion**: Export as `.glb` or `.gltf`.

Tips:

- Center the model at the origin before export.
- Use a reasonable scale (roughly 1–3 units wide).
- Transparent PNG as a flat plane is not true 3D — export an actual mesh.
