/** 浏览器端格式化（动态加载 Prettier，失败则回退原文） */
export async function formatJsSnippet(code: string): Promise<string> {
  try {
    const [prettier, babel, estree] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/babel'),
      import('prettier/plugins/estree'),
    ])
    const out = await prettier.format(code, {
      parser: 'babel',
      plugins: [babel, estree],
      semi: true,
      singleQuote: true,
      printWidth: 78,
      trailingComma: 'es5',
    })
    return out.trimEnd()
  } catch {
    return code
  }
}
