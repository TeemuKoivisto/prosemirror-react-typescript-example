import * as React from 'react'
import styled from 'styled-components'

export interface IUnderlineAttrs {
  spellcheck: boolean
}
interface IProps {
  attrs: IUnderlineAttrs
  contentDOM: HTMLElement
}
// Modified from https://gist.github.com/esmevane/7326b19e20a5670954b51ea8618d096d
export class Underline extends React.Component<IProps, {}> {
  hole: React.RefObject<HTMLParagraphElement>

  constructor(props: IProps) {
    super(props)
    this.hole = React.createRef()
  }

  componentDidMount() {
    this.hole.current!.appendChild(this.props.contentDOM)
  }

  render() {
    // return <p ref={this.hole} style={{textDecoration: 'underline'}}></p>
    const { attrs } = this.props
    return (
      <UnderlinedText
        ref={this.hole}
        spellCheck={attrs.spellcheck}
      />
    )
  }
}

const UnderlinedText = styled.p`
  text-decoration: underline;
`
