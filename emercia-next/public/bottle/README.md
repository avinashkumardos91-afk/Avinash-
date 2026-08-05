# Cinematic frame sequence goes here

Drop the Apple-style scroll-scrubbed frames in this folder:

    frame_0001.webp
    frame_0002.webp
    ...
    frame_0120.webp

Pipeline: generate a 360deg / exploded clip (Google Veo/Whisk, Midjourney video)
or shoot a turntable, extract frames (e.g. EZGif), export to WEBP/JPG, drop here.
Then set `count` in components/HeroBottle.tsx to the number of frames.

Until frames exist, the hero automatically uses the live react-three-fiber 3D bottle.
