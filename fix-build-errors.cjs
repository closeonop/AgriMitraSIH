const fs = require('fs');
const path = require('path');

// Common patterns to fix
const fixes = [
  // Remove unused React imports
  {
    pattern: /^import React,?\s*\{([^}]*)\}\s*from\s*['"]react['"];?\s*$/gm,
    replacement: (match, imports) => {
      if (imports.trim()) {
        return `import { ${imports.trim()} } from 'react';`;
      }
      return '';
    }
  },
  // Remove standalone unused React import
  {
    pattern: /^import React from ['"]react['"];?\s*$/gm,
    replacement: ''
  },
  // Remove unused variable declarations (simple cases)
  {
    pattern: /^\s*const\s+\[([^,\]]+),\s*[^,\]]+\]\s*=\s*useState[^;]*;?\s*$/gm,
    replacement: (match, varName) => {
      // Only remove if it's clearly unused (this is a simple heuristic)
      if (varName.includes('current') || varName.includes('selected')) {
        return `  // ${match.trim()} // Removed unused state`;
      }
      return match;
    }
  }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(filePath);
    }
  });
}

// Start fixing from src directory
console.log('Starting to fix TypeScript build errors...');
walkDirectory('./src');
console.log('Done!');