# Shared module

So one might wonder what is this keeping all the files in the root business. The explanation lies within how TS/JS treats imports and it's a bit complicated to the least. Keeping the type definitions in the root will map them correctly to `/module` subpaths and this seemed the simplest solution.

https://github.com/microsoft/TypeScript/issues/8305#issuecomment-842926799
https://github.com/microsoft/TypeScript/issues/33079#issuecomment-702617758
