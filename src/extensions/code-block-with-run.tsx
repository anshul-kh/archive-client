import CodeBlock from '@tiptap/extension-code-block'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CodeBlockComponent from './code-block-component'

export const CodeBlockWithRun = CodeBlock.extend({
  name: 'codeBlockWithRun',

  group: 'block',
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      language: { default: 'js' },
      code: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'code-block-with-run',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['code-block-with-run', HTMLAttributes]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent)
  },
})
