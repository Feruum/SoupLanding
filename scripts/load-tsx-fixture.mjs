import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

/** Render small TSX trees in Node tests without installing a browser test runner. */
export function loadTsxFixture(url) {
  const cache = new Map()
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename)
    const exports = {}
    cache.set(filename, exports)
    const nativeRequire = createRequire(filename)
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText
    vm.runInNewContext(
      code,
      {
        exports,
        require(name) {
          if (name.endsWith('.css')) return {}
          if (!name.startsWith('.')) return nativeRequire(name)
          const base = path.resolve(path.dirname(filename), name)
          const local = [base, `${base}.tsx`, `${base}.ts`].find(
            (file) => fs.existsSync(file) && fs.statSync(file).isFile(),
          )
          return local && /\.tsx?$/.test(local)
            ? load(local)
            : nativeRequire(name)
        },
      },
      { filename },
    )
    return exports
  }
  return load(fileURLToPath(url))
}
