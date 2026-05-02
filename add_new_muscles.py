"""
FitTrack — Add New Muscle Materials
Adds missing material slots to an existing male_muscles_named.glb
WITHOUT touching existing face assignments.

Usage:
  blender --background --python add_new_muscles.py
"""

import bpy
import bmesh
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT  = os.path.join(SCRIPT_DIR, "male_muscles_named.glb")
OUTPUT = os.path.join(SCRIPT_DIR, "male_muscles_named.glb")

# All desired materials with default colors
# Existing ones are kept as-is; only truly new ones are added
ALL_GROUPS = [
    ("Chest",       (0.85, 0.25, 0.25)),
    ("Upper Chest", (1.00, 0.60, 0.60)),
    ("Back",        (0.25, 0.45, 0.85)),
    ("Lats",        (0.13, 0.83, 0.93)),
    ("Traps",       (0.02, 0.71, 0.77)),
    ("Lower Back",  (0.03, 0.55, 0.70)),
    ("Shoulders",   (0.85, 0.55, 0.15)),
    ("Front Delts", (0.98, 0.57, 0.24)),
    ("Side Delts",  (0.98, 0.45, 0.09)),
    ("Rear Delts",  (0.92, 0.35, 0.02)),
    ("Biceps",      (0.25, 0.75, 0.45)),
    ("Triceps",     (0.65, 0.25, 0.85)),
    ("Forearms",    (0.64, 0.89, 0.21)),
    ("Core",        (0.90, 0.80, 0.15)),
    ("Abs",         (0.98, 0.80, 0.08)),
    ("Obliques",    (0.79, 0.54, 0.02)),
    ("Legs",        (0.85, 0.35, 0.55)),
    ("Quads",       (0.91, 0.47, 0.98)),
    ("Hamstrings",  (0.75, 0.15, 0.82)),
    ("Glutes",      (0.86, 0.15, 0.47)),
    ("Adductors",   (0.96, 0.25, 0.36)),
    ("Abductors",   (0.98, 0.44, 0.54)),
    ("Calves",      (0.18, 0.83, 0.75)),
    ("Other",       (0.55, 0.55, 0.55)),
]

def log(msg):
    print(f"[AddMuscles] {msg}", flush=True)

def make_material(name, color):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    mat.node_tree.nodes.clear()
    bsdf   = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
    output = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Roughness'].default_value  = 0.55
    return mat

def main():
    log("=" * 52)
    log("  FitTrack Add New Muscle Materials")
    log("=" * 52)

    if not os.path.exists(INPUT):
        log(f"ERROR: {INPUT} not found"); return

    # Clear scene and import
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    log(f"Importing: {INPUT}")
    bpy.ops.import_scene.gltf(filepath=INPUT)

    # Remove non-mesh objects
    for o in list(bpy.context.scene.objects):
        if o.type != 'MESH':
            bpy.data.objects.remove(o, do_unlink=True)

    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    if not meshes:
        log("ERROR: No mesh found"); return

    # Join if multiple meshes
    bpy.ops.object.select_all(action='DESELECT')
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active

    # Find existing material names
    existing_names = {mat.name for mat in obj.data.materials if mat}
    log(f"Existing materials: {sorted(existing_names)}")

    # Build index map for existing materials
    mat_idx = {mat.name: i for i, mat in enumerate(obj.data.materials) if mat}

    # Add only missing materials
    added = []
    for name, color in ALL_GROUPS:
        if name not in existing_names:
            mat = make_material(name, color)
            obj.data.materials.append(mat)
            mat_idx[name] = len(obj.data.materials) - 1
            added.append(name)
            log(f"  + Added: {name}")
        else:
            log(f"  . Kept:  {name}")

    if not added:
        log("Nothing to add — all materials already present.")
    else:
        # Assign 1 placeholder face per new material so it survives GLB export
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.mode_set(mode='EDIT')
        bm = bmesh.from_edit_mesh(obj.data)
        bm.faces.ensure_lookup_table()

        # Find faces currently assigned to "Other" (or index 0 as fallback)
        other_idx = mat_idx.get('Other', 0)
        other_faces = [f for f in bm.faces if f.material_index == other_idx]
        log(f"Other-faces available for placeholders: {len(other_faces)}")

        for i, name in enumerate(added):
            if i < len(other_faces):
                other_faces[i].material_index = mat_idx[name]
                log(f"  Placeholder face {i} → {name}")
            else:
                log(f"  WARNING: no free face for {name} — material may be dropped on export")

        bmesh.update_edit_mesh(obj.data)
        bpy.ops.object.mode_set(mode='OBJECT')

    log(f"Exporting to: {OUTPUT}")
    bpy.ops.export_scene.gltf(
        filepath=OUTPUT,
        export_format='GLB',
        use_selection=False,
        export_materials='EXPORT',
        export_texcoords=True,
        export_normals=True,
    )
    log(f"✓ Done! Materials now in model: {[m.name for m in obj.data.materials if m]}")

main()
