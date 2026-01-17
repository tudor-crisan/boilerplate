try {
  await import('./next.config.mjs');
  console.log('✅ next.config.mjs and all its imports are syntactically correct and load successfully.');
} catch (error) {
  console.error('❌ Error loading next.config.mjs:');
  console.error(error);
  process.exit(1);
}
