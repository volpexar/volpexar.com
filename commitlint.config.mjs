export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Subjects in this repo routinely describe both a change and its context,
    // which runs past the conventional default of 72.
    'header-max-length': [2, 'always', 120],
    // Every commit carries a scope, usually the issue number: `feat(12): ...`.
    // This rejects both a missing scope and empty parentheses.
    'scope-empty': [2, 'never'],
  },
}
