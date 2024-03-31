#!/bin/bash
echo "Before running this, ensure you've installed css min (npm install -g --registry https://registry.npmjs.org/ cssmin)"
echo "Clearing previous contents";
rm styles/minified/*.min.css

echo "Generating new minified files";
for file in styles/*.css
do
    # Get the filename without the path and extension
    filename=$(basename "$file" .css)

    # Generate a hash based on the contents of the CSS file
    hash=$(md5sum "$file" | cut -d' ' -f1 | cut -c1-8)

    # Minify the CSS file and save it with the hash and .min.css extension
    outputFilename="styles/minified/${filename}.${hash}.min.css"
    cssmin "$file" > "${outputFilename}"
    echo "Minified $file -> ${outputFilename}"
    sed -i "s|styles/minified/${filename}\.[a-z0-9]\+\.min\.css|styles/minified/${filename}.${hash}.min.css|g" index.html policy/*.html
    aws s3api put-object --bucket fusion-assets --endpoint-url "${FUSION_ASSETS_ENDPOINT}" --body "${outputFilename}" --key "${outputFilename}"

done

echo "CSS minification completed."
