import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { RouteComponentProps } from 'react-router'

interface IProps extends RouteComponentProps<{}> {
  className?: string
}

export function NavBar(props: IProps) {
  const { className } = props
  return (
    <Container className={className}>
      <Nav>
        <Link to="/" exact activeClassName="current">Full</Link>
        <Link to="/minimal" activeClassName="current">Minimal</Link>
        <Link to="/atlassian" activeClassName="current">Atlassian</Link>
        <Link to="/fullv1" activeClassName="current">Full v1</Link>
      </Nav>
    </Container>
  )
}

const Container = styled.div`
  background: var(--color-primary);
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  padding: 1rem;
`
const Nav = styled.nav`
  align-items: center;
  display: flex;
`
const Link = styled(NavLink)`
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: 0.2s hover;
  &:hover {
    text-decoration: underline;
  }
  &.current {
    font-weight: 600;
  }
`
