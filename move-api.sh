#!/bin/bash

# Function to convert API endpoint to App Router format
convert_api_file() {
  local source_file=$1
  local endpoint_name=$(basename "$source_file" .js)
  local dir_path=$2
  local target_dir="next-app/src/app/api/$dir_path"
  
  # Create endpoint directory
  mkdir -p "$target_dir"
  
  # If it's a dynamic route [param].js file
  if [[ $endpoint_name == \[*\] ]]; then
    # Extract parameter name
    param_name=${endpoint_name//[\[\]]/}
    
    # Create directory for the dynamic route
    mkdir -p "$target_dir/[$param_name]"
    
    # Create route.js file
    cat > "$target_dir/[$param_name]/route.js" <<EOL
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const $param_name = params.$param_name;
$(cat "$source_file" | grep -v "export default" | grep -v "import" | grep -v "req.query" | sed 's/req,res/request/g' | sed 's/res.status/return NextResponse/g' | sed "s/req.query.$param_name/params.$param_name/g")
  }
}
EOL
  else
    # Create route.js file for standard endpoint
    cat > "$target_dir/route.js" <<EOL
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Extract query parameters from request URL
    const { searchParams } = new URL(request.url);
$(cat "$source_file" | grep -v "export default" | grep -v "import" | grep -v "req," | grep -v "res." | sed 's/const { /const /g' | sed 's/} = req.query;/= {/g')
    // Convert URL search params to expected values
    const limit = searchParams.get('limit') || 50;
    const page = searchParams.get('page') || 1;
    const sort_by = searchParams.get('sort_by') || 'year';
    const sort_order = searchParams.get('sort_order') || 'desc';
    const year = searchParams.get('year');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const min_gains = searchParams.get('min_gains');
    const max_gains = searchParams.get('max_gains');
    const listing_at = searchParams.get('listing_at');
$(cat "$source_file" | grep -v "export default" | grep -v "import" | grep -v "req," | grep -v "const {" | sed 's/res.status(200).json/return NextResponse.json/g' | sed 's/res.status(404).json/return NextResponse.json/g' | sed 's/res.status(500).json/return NextResponse.json/g' | sed 's/return res.status(400).json/return NextResponse.json/g')
  }
}
EOL
  fi
  
  echo "Converted $source_file to App Router format in $target_dir"
}

# Process all API files
process_api_dir() {
  local source_dir=$1
  local target_path=$2
  
  for file in "$source_dir"/*.js; do
    if [ -f "$file" ]; then
      convert_api_file "$file" "$target_path"
    fi
  done
  
  # Process subdirectories
  for dir in "$source_dir"/*/; do
    if [ -d "$dir" ]; then
      dir_name=$(basename "$dir")
      process_api_dir "$dir" "$target_path/$dir_name"
    fi
  done
}

# Start processing from pages/api
process_api_dir "pages/api" ""

echo "API conversion completed. The API endpoints have been moved to next-app/src/app/api/"
echo "You can now run your Next.js app from the next-app directory with 'cd next-app && npm run dev'" 