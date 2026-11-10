# asi-site-scripts

Experience layer for the Automation Services, Inc. website (Webflow), built by Origin.

- `asi-experience.js`: one ES5 file, loaded site-wide from the Webflow footer via jsDelivr pinned to a commit with an SRI hash. Every module stays dormant until the page markup carries its `data-asi-*` hook.
- `video/`: short muted loops (rendered with the ASI plant visualizer, HMI captures, drone footage). Loaded from the same commit as the script.
- `track.json`: per-frame camera matrices measured from the drone footage, so the hero data chips stay pinned to the plant.

Release: commit, then update the footer embed to the new commit sha and SRI hash, then publish staging.
