import { execSync } from 'child_process';
import process from 'process';

console.log('🔄 Starting update process...');

try {
  // Get commit message from arguments, default to "update"
  // args will be [node, scriptPath, ...customArgs]
  const args = process.argv.slice(2);
  const message = args.length > 0 ? args.join(' ') : 'update';

  console.log('📦 Adding files...');
  execSync('git add .', { stdio: 'inherit' });

  console.log(`📝 Committing with message: "${message}"...`);
  try {
      execSync(`git commit -am "${message}"`, { stdio: 'inherit' });
  } catch (error) {
     // If nothing to commit, git commit returns non-zero exit code.
     // We can check the output or just proceed if it's a "clean" status.
     console.log('⚠️  Commit failed (maybe nothing to commit?). Continuing to push...');
  }

  console.log('🚀 Pushing to remote...');
  execSync('git push', { stdio: 'inherit' });

  console.log('✅ Update complete!');
} catch (error) {
  console.error('❌ Update failed:', error.message);
  process.exit(1);
}
