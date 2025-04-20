#!/bin/bash

# Function to update a file
update_file() {
  local file=$1
  echo "Updating $file..."
  
  # Add check for file existence and improve error handling
  sed -i '' 's/const dataFilePath = path.join(process.cwd(), '\''output'\''/const dataFilePath = path.join(process.cwd(), '\''next-app'\'', '\''output'\''/g' "$file"
  
  # Add file existence check after the path.join line if it doesn't already exist
  if ! grep -q "if (!fs.existsSync(dataFilePath))" "$file"; then
    sed -i '' '/const dataFilePath/a\\
    // Check if file exists\\
    if (!fs.existsSync(dataFilePath)) {\\
      console.error(`File not found: ${dataFilePath}`);\\
      return res.status(404).json({ error: "Data file not found" });\\
    }\\
    ' "$file"
  fi
  
  # Improve error handling
  sed -i '' 's/error: "Failed to fetch data"/error: "Failed to fetch data", details: error.message/g' "$file"
}

# Update all API files
find pages/api -name "*.js" -type f | while read file; do
  update_file "$file"
done

echo "All API handlers updated successfully!" 