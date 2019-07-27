import rafSchedule from 'raf-schd'
import { Node, DOMSerializer, DOMOutputSpec } from 'prosemirror-model'
import { browser } from '@atlaskit/editor-common'

const MATCH_NEWLINES = new RegExp('\n', 'g')

// For browsers <= IE11, we apply style overrides to render a basic code box
const isIE11 = browser.ie && browser.ie_version <= 11
const toDOM = (node: Node) =>
  [
    'div',
    { class: 'code-block' + (isIE11 ? ' ie11' : '') },
    ['div', { class: 'line-number-gutter', contenteditable: 'false' }],
    [
      'div',
      { class: 'code-content' },
      [
        'pre',
        [
          'code',
          { 'data-language': node.attrs.language || '', spellcheck: 'false' },
          0,
        ],
      ],
    ],
  ] as DOMOutputSpec

export class CodeBlockView {
  node: Node
  dom: HTMLElement
  contentDOM: HTMLElement
  lineNumberGutter: HTMLElement

  constructor(node: Node) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node))
    this.node = node
    this.dom = dom as HTMLElement
    this.contentDOM = contentDOM as HTMLElement
    this.lineNumberGutter = this.dom.querySelector(
      '.line-number-gutter',
    ) as HTMLElement

    this.ensureLineNumbers()
  }

  private ensureLineNumbers = rafSchedule(() => {
    let lines = 1
    this.node.forEach(node => {
      const text = node.text
      if (text) {
        lines += (node.text!.match(MATCH_NEWLINES) || []).length
      }
    })

    while (this.lineNumberGutter.childElementCount < lines) {
      this.lineNumberGutter.appendChild(document.createElement('span'))
    }
    while (this.lineNumberGutter.childElementCount > lines) {
      this.lineNumberGutter.removeChild(this.lineNumberGutter.lastChild!)
    }
  })

  update(node: Node) {
    if (node.type !== this.node.type) {
      return false
    }
    if (node !== this.node) {
      if (node.attrs.language !== this.node.attrs.language) {
        this.contentDOM.setAttribute(
          'data-language',
          node.attrs.language || '',
        )
      }
      this.node = node
      this.ensureLineNumbers()
    }
    return true
  }

  ignoreMutation(record: MutationRecord) {
    // Ensure updating the line-number gutter doesn't trigger reparsing the codeblock
    return (
      record.target === this.lineNumberGutter ||
      record.target.parentNode === this.lineNumberGutter
    )
  }
}

export default (node: Node) => new CodeBlockView(node)
