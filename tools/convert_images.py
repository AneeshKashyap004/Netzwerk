#!/usr/bin/env python3
"""
convert_images.py

Simple utility to generate WebP and resized JPEG/WebP variants for images used in the site.

Install requirements locally:
  python3 -m pip install --user pillow

Usage examples:
  # generate variants for hero and feature images
  python3 tools/convert_images.py assets/images/hero-photo.jpg --sizes 1200 800 --feature-sizes 400

Or run without args to convert all JPGs in assets/images/ (safe default).
"""
import sys
from pathlib import Path
try:
    from PIL import Image
except Exception as e:
    print("Pillow is required. Install with: python3 -m pip install --user pillow")
    raise

def make_variants(src_path: Path, sizes=(None,), out_formats=('webp','jpg'), quality=80):
    im = Image.open(src_path).convert('RGB')
    w,h = im.size
    for fmt in out_formats:
        for s in sizes:
            if s is None:
                out_name = src_path.with_suffix('.' + fmt)
                im.save(out_name, fmt.upper(), quality=quality)
                print('Saved', out_name)
            else:
                nw = int(s)
                nh = int(nw * h / w)
                r = im.resize((nw, nh), Image.LANCZOS)
                out_name = src_path.with_name(src_path.stem + f'-{nw}.{fmt}')
                r.save(out_name, fmt.upper(), quality=quality)
                print('Saved', out_name)

def main(argv):
    import argparse
    p = argparse.ArgumentParser(description='Generate WebP and resized variants')
    p.add_argument('files', nargs='*', help='image files to convert (defaults to assets/images/*.jpg)')
    p.add_argument('--sizes', nargs='*', type=int, default=[1200,800], help='sizes for large images (widths)')
    p.add_argument('--feature-sizes', nargs='*', type=int, default=[400], help='sizes for feature images (widths)')
    p.add_argument('--quality', type=int, default=80)
    args = p.parse_args(argv)

    files = args.files or [str(p) for p in Path('assets/images').glob('*.jpg')]
    for f in files:
        pth = Path(f)
        if not pth.exists():
            print('Skipping missing', pth)
            continue
        # decide sizes heuristically by filename
        if 'hero' in pth.stem:
            sizes = [None] + args.sizes
        elif 'feature' in pth.stem:
            sizes = [None] + args.feature_sizes
        else:
            sizes = [None, 800]
        make_variants(pth, sizes=sizes, out_formats=('webp','jpg'), quality=args.quality)

if __name__ == '__main__':
    main(sys.argv[1:])
