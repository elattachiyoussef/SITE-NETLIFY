#!/bin/bash

# Script d'optimisation des images pour améliorer le LCP

# Installer les dépendances si nécessaires
if ! command -v convert &> /dev/null; then
    echo "ImageMagick n'est pas installé. Installation en cours..."
    apt-get update && apt-get install -y imagemagick
fi

# Optimiser les images critiques pour le LCP
echo "Optimisation des images critiques..."

# Optimiser l'image d'arrière-plan du hero
convert assets/images/hero-bg.jpg -strip -quality 80 -resize 1920x1080 -sampling-factor 4:2:0 -interlace Plane assets/images/hero-bg.optimized.jpg
mv assets/images/hero-bg.optimized.jpg assets/images/hero-bg.jpg

# Optimiser le logo
convert assets/images/logo.png -strip -quality 90 assets/images/logo.optimized.png
mv assets/images/logo.optimized.png assets/images/logo.png

# Optimiser les images PNG
find . -type f -name "*.png" -exec convert {} -strip -quality 85 {} \;

# Optimiser les images JPG
find . -type f -name "*.jpg" -exec convert {} -strip -quality 85 {} \;

# Optimiser les images JPEG
find . -type f -name "*.jpeg" -exec convert {} -strip -quality 85 {} \;

# Créer des versions WebP
find . -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" \) -exec sh -c 'cwebp -q 85 "$1" -o "${1%.*}.webp"' sh {} \;

echo "Optimisation terminée!" 