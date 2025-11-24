Image conversion helpers
========================

This folder contains a small helper to create WebP and resized variants of site images.

Usage
-----
1. Install Pillow for your user (no sudo required):

   python3 -m pip install --user pillow

2. Run the converter for the images in `assets/images`:

   python3 tools/convert_images.py

3. Alternatively, convert specific images and sizes:

   python3 tools/convert_images.py assets/images/hero-photo.jpg --sizes 1200 800 --feature-sizes 400

The script will create files such as:

- assets/images/hero-photo.webp
- assets/images/hero-photo-1200.webp
- assets/images/hero-photo-800.webp
- assets/images/feature-photo.webp
- assets/images/feature-photo-400.webp

After generating WebP files, the `<picture>` markup already added to `index.html` will serve WebP to supported browsers.
