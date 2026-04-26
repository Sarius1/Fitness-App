"""
FitTrack — Muscle Group Splitter
Assigns named materials to a human body GLB based on vertex position + face normals.

Usage (no Blender UI needed):
  blender --background --python split_muscles.py

Output: male_muscles_named.glb  (same folder as this script)
"""

import bpy
import bmesh
import os
import sys

# ── PATHS ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT  = os.path.join(SCRIPT_DIR, "male_base_mesh_with_muscle_detail.glb")
OUTPUT = os.path.join(SCRIPT_DIR, "male_muscles_named.glb")

# ── MUSCLE GROUPS (name, default_color) ───────────────────────────────────────
# Colors are just defaults — FitTrack app overrides them at runtime
GROUPS = [
    ("Chest",     (0.85, 0.25, 0.25)),   # red
    ("Back",      (0.25, 0.45, 0.85)),   # blue
    ("Shoulders", (0.85, 0.55, 0.15)),   # orange
    ("Biceps",    (0.25, 0.75, 0.45)),   # green
    ("Triceps",   (0.65, 0.25, 0.85)),   # purple
    ("Core",      (0.90, 0.80, 0.15)),   # yellow
    ("Legs",      (0.85, 0.35, 0.55)),   # pink
    ("Other",     (0.55, 0.55, 0.55)),   # grey (neck, hands, feet)
]

# ── REGION DEFINITIONS ────────────────────────────────────────────────────────
# Each region: (group_name, up_min, up_max, depth_min, depth_max, lat_max, normal_depth_min, normal_depth_max)
# Normalized coords: up 0=feet→1=head, depth 0=back→1=front, lateral 0=center→1=edge
# Priority order: first match wins
REGIONS = [
    # name          up_lo  up_hi  dep_lo dep_hi  lat   nrm_dep_lo  nrm_dep_hi
    ("Other",        0.90,  1.00,  0.00,  1.00,  1.0,  -1.0,  1.0),  # head
    ("Other",        0.00,  0.10,  0.00,  1.00,  1.0,  -1.0,  1.0),  # feet
    ("Shoulders",    0.70,  0.82,  0.00,  1.00,  1.0,  -1.0,  1.0),  # shoulder caps (lateral > 0.22 checked separately)
    ("Biceps",       0.50,  0.72,  0.30,  1.00,  1.0,   0.15,  1.0),  # front of arm
    ("Triceps",      0.50,  0.72,  0.00,  0.55,  1.0,  -1.0, -0.10),  # back of arm
    ("Chest",        0.62,  0.82,  0.45,  1.00,  0.22, -1.0,  1.0),  # front upper torso (not arms)
    ("Back",         0.62,  0.88,  0.00,  0.52,  0.30, -1.0,  1.0),  # rear upper torso
    ("Core",         0.40,  0.64,  0.42,  1.00,  0.22, -1.0,  1.0),  # front mid torso
    ("Back",         0.38,  0.68,  0.00,  0.50,  0.30, -1.0,  1.0),  # rear mid torso / lower back
    ("Legs",         0.10,  0.50,  0.00,  1.00,  1.0,  -1.0,  1.0),  # thighs + lower legs
    ("Other",        0.00,  1.00,  0.00,  1.00,  1.0,  -1.0,  1.0),  # fallback
]

# ── HELPERS ───────────────────────────────────────────────────────────────────
def log(msg):
    print(f"[MuscleScript] {msg}", flush=True)

def norm(v, lo, hi):
    return (v - lo) / (hi - lo) if hi != lo else 0.5

def detect_axes(obj):
    """Detect which world axis is UP (tallest), DEPTH (shallowest), LATERAL."""
    verts = [obj.matrix_world @ v.co for v in obj.data.vertices]
    xs = [v.x for v in verts]; ys = [v.y for v in verts]; zs = [v.z for v in verts]
    ranges = [max(xs)-min(xs), max(ys)-min(ys), max(zs)-min(zs)]
    mins   = [min(xs), min(ys), min(zs)]
    maxs   = [max(xs), max(ys), max(zs)]
    axes   = ['X','Y','Z']

    up      = ranges.index(max(ranges))
    rest    = [i for i in range(3) if i != up]
    depth   = rest[0] if ranges[rest[0]] < ranges[rest[1]] else rest[1]
    lateral = [i for i in range(3) if i not in (up, depth)][0]

    log(f"Bounding box  X:{ranges[0]:.3f}  Y:{ranges[1]:.3f}  Z:{ranges[2]:.3f}")
    log(f"Auto-detected  UP={axes[up]}  DEPTH={axes[depth]}  LATERAL={axes[lateral]}")
    return up, depth, lateral, mins, maxs

def classify(pu, pd, pl, nu, nd, nl):
    """
    pu/pd/pl: normalized position (0..1) along up/depth/lateral axes
    nu/nd/nl: face normal components along those axes
    Returns group name.
    """
    acl = abs(pl - 0.5)        # 0=center  0.5=edge

    for (name, u0, u1, d0, d1, lat_max, nd0, nd1) in REGIONS:
        if not (u0 <= pu <= u1):   continue
        if not (d0 <= pd <= d1):   continue
        if not (nd0 <= nd <= nd1): continue
        # Shoulder/arm check: must be lateral enough
        if name in ("Shoulders", "Biceps", "Triceps") and acl < 0.18:
            continue
        # Chest/Core/Back: must NOT be too far lateral (would be arm)
        if name in ("Chest", "Core") and acl > 0.24:
            continue
        return name

    return "Other"

# ── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    log("=" * 52)
    log("  FitTrack Muscle Group Splitter  v1.0")
    log("=" * 52)

    if not os.path.exists(INPUT):
        log(f"ERROR: File not found:\n  {INPUT}")
        log("Make sure this script is in the same folder as the .glb file.")
        sys.exit(1)

    # 1 ── Clear default scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    # 2 ── Import
    log(f"Importing: {INPUT}")
    bpy.ops.import_scene.gltf(filepath=INPUT)

    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    if not meshes:
        log("ERROR: No mesh found after import!")
        sys.exit(1)

    obj = meshes[0]
    log(f"Mesh: '{obj.name}'  |  {len(obj.data.vertices):,} verts  |  {len(obj.data.polygons):,} faces")

    # 3 ── Detect coordinate axes
    up, depth, lateral, mins, maxs = detect_axes(obj)

    # 4 ── Create named materials
    log("Creating materials ...")
    obj.data.materials.clear()
    mat_idx = {}

    for name, color in GROUPS:
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        mat.node_tree.nodes.clear()

        bsdf   = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
        output = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
        mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

        bsdf.inputs['Base Color'].default_value = (*color, 1.0)
        bsdf.inputs['Roughness'].default_value  = 0.55

        obj.data.materials.append(mat)
        mat_idx[name] = len(obj.data.materials) - 1
        log(f"  [{mat_idx[name]:2d}] {name}")

    # 5 ── Assign faces
    log("Assigning faces ...")
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')

    bm = bmesh.from_edit_mesh(obj.data)
    bm.faces.ensure_lookup_table()

    counts = {name: 0 for name, _ in GROUPS}
    mat3   = obj.matrix_world.to_3x3()

    for face in bm.faces:
        c = obj.matrix_world @ face.calc_center_median()
        n = (mat3 @ face.normal).normalized()
        coords  = [c.x, c.y, c.z]
        normals = [n.x, n.y, n.z]

        pu = norm(coords[up],      mins[up],      maxs[up])
        pd = norm(coords[depth],   mins[depth],   maxs[depth])
        pl = norm(coords[lateral], mins[lateral], maxs[lateral])
        nu = normals[up]
        nd = normals[depth]
        nl = normals[lateral]

        group = classify(pu, pd, pl, nu, nd, nl)
        face.material_index = mat_idx[group]
        counts[group] += 1

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode='OBJECT')

    # 6 ── Report
    total = sum(counts.values())
    log("Face assignment:")
    for name, c in counts.items():
        bar = "█" * int(30 * c / total) if total else ""
        log(f"  {name:12s} {c:6,} ({100*c/total:5.1f}%)  {bar}")

    # 7 ── Export
    log(f"Exporting to: {OUTPUT}")
    bpy.ops.export_scene.gltf(
        filepath=OUTPUT,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_texcoords=True,
        export_normals=True,
    )

    log("")
    log("✓  Done!  New file: male_muscles_named.glb")
    log("   Material names: " + ", ".join(n for n,_ in GROUPS))
    log("")

main()
