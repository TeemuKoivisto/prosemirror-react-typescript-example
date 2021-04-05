import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'

import { UIProps } from '..'

interface IProps {
  className?: string
  initialProps: UIProps,
  useListenProps: (cb: (newProps: UIProps) => void) => void
}

export const BlockQuote = forwardRef((props: IProps, ref: any) => {
  const { className, initialProps, useListenProps } = props
  useListenProps(handlePropsUpdate)
  const [attrs, setAttrs] = useState({ ...initialProps.attrs })

  function handlePropsUpdate(newProps: any) {
    // console.log(newProps)
  }
  return (
    <StyledBlockQuote className={className} ref={ref}/>
  )
})

export const StyledBlockQuote = styled.blockquote`
  box-sizing: border-box;
  color: #6a737d;
  padding: 0 1em;
  border-left: 4px solid #dfe2e5;
  margin: 0.2rem 0 0 0;
  margin-right: 0;

  [dir='rtl'] & {
    padding-left: 0;
    padding-right: 4px;
  }

  &:first-child {
    margin-top: 0;
  }

  &::before {
    content: '';
  }

  &::after {
    content: none;
  }

  & p {
    display: block;
  }

  & table,
  & table:last-child {
    display: inline-table;
  }
`
