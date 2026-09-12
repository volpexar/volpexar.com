// Install Git hooks, except where there are no commits to lint.
//
// npm runs `prepare` on every install, including on build servers that install
// with --omit=dev. Husky is a devDependency, so there it is not installed and a
// bare `husky` call fails the whole build with "command not found" (exit 127).
//
// Vercel sets CI=1, not CI='true', so husky's documented check for the string
// 'true' does not catch it: test for presence instead.
// https://vercel.com/docs/environment-variables/system-environment-variables
if (process.env.CI || process.env.NODE_ENV === 'production') {
  process.exit(0)
}

const husky = (await import('husky')).default
console.log(husky())
