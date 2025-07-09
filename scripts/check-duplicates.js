const fs = require('fs');
const path = require('path');

// 검사할 패턴들
const PATTERNS = [
  'webglcontextlost',
  'renderer.info.reset',
  'useFrame',
  'setState',
  'addEventListener',
  'removeEventListener'
];

// 검사할 디렉토리들
const SEARCH_DIRS = [
  'src',
  'public'
];

function findDuplicates(directory, pattern) {
  const duplicates = [];
  
  function searchInDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        searchInDir(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const matches = content.match(new RegExp(pattern, 'g'));
          
          if (matches && matches.length > 1) {
            duplicates.push({
              file: filePath,
              pattern: pattern,
              count: matches.length,
              lines: content.split('\n').map((line, index) => {
                if (line.includes(pattern)) {
                  return `${index + 1}: ${line.trim()}`;
                }
                return null;
              }).filter(Boolean)
            });
          }
        } catch (error) {
          console.warn(`파일 읽기 실패: ${filePath}`);
        }
      }
    }
  }
  
  searchInDir(directory);
  return duplicates;
}

function main() {
  console.log('🔍 중복 코드 검사 시작...\n');
  
  let hasDuplicates = false;
  
  for (const searchDir of SEARCH_DIRS) {
    if (!fs.existsSync(searchDir)) {
      console.log(`⚠️  디렉토리 없음: ${searchDir}`);
      continue;
    }
    
    console.log(`📁 ${searchDir} 검사 중...`);
    
    for (const pattern of PATTERNS) {
      const duplicates = findDuplicates(searchDir, pattern);
      
      if (duplicates.length > 0) {
        hasDuplicates = true;
        console.log(`\n❌ 중복 발견: "${pattern}"`);
        
        for (const dup of duplicates) {
          console.log(`  📄 ${dup.file} (${dup.count}개)`);
          dup.lines.forEach(line => {
            console.log(`    ${line}`);
          });
        }
      }
    }
  }
  
  if (!hasDuplicates) {
    console.log('\n✅ 중복 코드 없음!');
    process.exit(0);
  } else {
    console.log('\n⚠️  중복 코드 발견! 리뷰가 필요합니다.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findDuplicates, PATTERNS }; 