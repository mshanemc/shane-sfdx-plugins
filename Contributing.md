# Contributing

Oh, you want to help? Thank you so much! Seriously, that's wonderful.

Tips:

1. Tests are encouraged. I mostly do end-to-end stuff using actual orgs. Check out the test helpers for some of that.
2. There's some commonly used libraries in here (fs-extra, request-promise-native). Try to use the stuff in jsforce when you can, then existing libs, then new dependencies.
3. There's some helpers also for converting between xml and json stuff...helpful for local metadata edits
4. Look around the existing commands a bit and try to match styles so it's easier for other users to make sense of all this. Examples
   a. return some object for `--json` users
   b. use the oclif/sfdx flags types and options

## Packaging/Versions

Just PR your code changes. I'll handle the version/publishing process after merging your changes in
