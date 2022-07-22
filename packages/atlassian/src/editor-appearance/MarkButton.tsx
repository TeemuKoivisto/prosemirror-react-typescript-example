import React from 'react'
import styled from 'styled-components'

interface IProps {
  className?: string
  active: boolean
  name: string
  icon: React.ReactNode
  onClick: () => void
}
function MarkButtonEl(props: IProps) {
  const { className, active, name, icon, onClick } = props
  return (
    <Button
      className={className}
      active={active}
      name={name}
      onClick={onClick}
    >
      <SvgWrapper>
        {icon}
      </SvgWrapper>
    </Button>
  )
}

interface IButtonProps { active: boolean }
const SvgWrapper = styled.span`
  display: flex;
`
const Button = styled.button`
  background: ${(props: IButtonProps) => props.active ? '#f0f8ff' : 'transparent'};
  border: ${(props: IButtonProps) => props.active ? '1px solid #5a6ecd' : '1px solid transparent'};
  cursor: pointer;
  display: flex;
  margin-right: 5px;
  padding: 1px;
  &:hover {
    background: #f0f8ff;
    opacity: 0.6;
  }
`
export const MarkButton = styled(MarkButtonEl)``
