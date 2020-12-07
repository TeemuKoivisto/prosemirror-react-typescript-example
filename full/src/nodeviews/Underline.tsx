import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'

export interface IUnderlineAttrs {
  spellcheck: boolean
}
interface IProps {
  attrs: IUnderlineAttrs
  contentDOM?: HTMLElement
}

// Modified from https://gist.github.com/esmevane/7326b19e20a5670954b51ea8618d096d
export function Underline(props: IProps) {
  const { attrs, contentDOM } = props
  const ref = useRef<HTMLParagraphElement>(null)
  // You _have_ to use layoutEffect, otherwise the contentDOM is not appended when a new Underline node & nodeview
  // is created with eg Ctrl+n
  useLayoutEffect(() => {
    if (ref.current && contentDOM) ref.current.appendChild(contentDOM)
  }, [])
  return (
    <UnderlinedText
      ref={ref}
      // spellCheck={attrs.spellcheck}
    />
  )
}

const UnderlinedText = styled.p`
  text-decoration: underline;
`
