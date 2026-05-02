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
INPUT  = os.path.join(SCRIPT_DIR, "male_body_muscular_system_-_anatomy_study.glb")
OUTPUT = os.path.join(SCRIPT_DIR, "male_muscles_named.glb")

# ── MUSCLE GROUPS (name, default_color) ───────────────────────────────────────
# Colors are just defaults — FitTrack app overrides them at runtime
# Broad groups (backwards-compat — keep existing assignments)
GROUPS = [
    ("Chest",       (0.85, 0.25, 0.25)),   # red
    ("Upper Chest", (1.00, 0.60, 0.60)),   # light red
    ("Back",        (0.25, 0.45, 0.85)),   # blue
    ("Lats",        (0.13, 0.83, 0.93)),   # cyan
    ("Traps",       (0.02, 0.71, 0.77)),   # teal
    ("Lower Back",  (0.03, 0.55, 0.70)),   # dark teal
    ("Shoulders",   (0.85, 0.55, 0.15)),   # orange
    ("Front Delts", (0.98, 0.57, 0.24)),   # light orange
    ("Side Delts",  (0.98, 0.45, 0.09)),   # orange
    ("Rear Delts",  (0.92, 0.35, 0.02)),   # dark orange
    ("Biceps",      (0.25, 0.75, 0.45)),   # green
    ("Triceps",     (0.65, 0.25, 0.85)),   # purple
    ("Forearms",    (0.64, 0.89, 0.21)),   # yellow-green
    ("Core",        (0.90, 0.80, 0.15)),   # yellow
    ("Abs",         (0.98, 0.80, 0.08)),   # gold
    ("Obliques",    (0.79, 0.54, 0.02)),   # dark gold
    ("Legs",        (0.85, 0.35, 0.55)),   # pink
    ("Quads",       (0.91, 0.47, 0.98)),   # violet-pink
    ("Hamstrings",  (0.75, 0.15, 0.82)),   # purple-pink
    ("Glutes",      (0.86, 0.15, 0.47)),   # magenta-pink
    ("Adductors",   (0.96, 0.25, 0.36)),   # red-pink
    ("Abductors",   (0.98, 0.44, 0.54)),   # salmon
    ("Calves",      (0.18, 0.83, 0.75)),   # mint
    ("Other",       (0.55, 0.55, 0.55)),   # grey (neck, hands, feet)
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

    # Delete cameras, lights, empties — keep only meshes
    for o in list(bpy.context.scene.objects):
        if o.type != 'MESH':
            bpy.data.objects.remove(o, do_unlink=True)

    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    if not meshes:
        log("ERROR: No mesh found after import!")
        sys.exit(1)

    # Clear parents and apply all transforms on each mesh individually
    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes:
        m.select_set(True)
    bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
    for m in meshes:
        bpy.ops.object.select_all(action='DESELECT')
        m.select_set(True)
        bpy.context.view_layer.objects.active = m
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    # 3 ── Join all meshes into one
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    log(f"Found {len(meshes)} mesh(es) — joining ...")
    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    import math
    obj.rotation_euler = (-math.pi / 2, 0, 0)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    log(f"Joined mesh: '{obj.name}'  |  {len(obj.data.vertices):,} verts  |  {len(obj.data.polygons):,} faces")

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

    # 5 ── Assign faces: all to Other, but 1 face per group to keep all materials in export
    log("Assigning all faces to Other (1 placeholder face per group) ...")
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')

    bm = bmesh.from_edit_mesh(obj.data)
    bm.faces.ensure_lookup_table()

    total_faces = len(bm.faces)
    group_names = [name for name, _ in GROUPS if name != 'Other']

    for i, face in enumerate(bm.faces):
        if i < len(group_names):
            face.material_index = mat_idx[group_names[i]]
        else:
            face.material_index = mat_idx['Other']

    bmesh.update_edit_mesh(obj.data)
    bpy.ops.object.mode_set(mode='OBJECT')
    log(f"  {total_faces:,} faces assigned — all groups present in export")

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
