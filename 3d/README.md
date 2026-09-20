# Noir bottle: image to 3D pipeline state

Skill used: `image-to-3d-pipeline` (installed in ~/.agents/skills/). Workflow: Hunyuan3D, per its Example 3 (e-commerce product 360).

## Done

1. Source: `noir-source.jpg` (copy of images/Ligero noir_with_box...jpeg, 2048x2048).
2. Background removal: `cutout.swift` (Apple Vision, VNGenerateForegroundInstanceMaskRequest) -> `noir-cutout.png`, transparent, subject 60.2% of frame.
3. Upload asset: `noir-upload-1024.png` (1024px PNG with alpha). This is the file for Hunyuan3D.

## Waiting on: generation (needs a human or an API key)

Either:

- Free path: upload `noir-upload-1024.png` at https://hunyuan3d.tencent.com, mode "Image to 3D", Quality High, Texture enabled. Download the GLB into this folder as `noir-raw.glb`.
- API path: set FAL_KEY or MESHY_API_KEY in the environment, then this thread automates generation end to end.

## Then (automated in this folder)

1. Validate the GLB (mesh, textures, scale).
2. Optimize: `npx @gltf-transform/cli optimize noir-raw.glb noir-web.glb --compress draco` plus texture resize to 1024. Target under 800KB per the blueprint's 3D-viewer rule.
3. Deliver embed: model-viewer snippet for the Noctis PDP (auto-rotate, camera-controls, shadow-intensity 1), wired to the product page spec in ligero/site-blueprint.md section 7.

## Reusable

`cutout.swift <input> <output.png>` works for every bottle shot: AUBE, Fleur, the tray lineup for the Discovery Set page.
