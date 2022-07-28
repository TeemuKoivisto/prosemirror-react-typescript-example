import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

interface IProps {
  className?: string
}

export function NavBar(props: IProps) {
  const { className = '' } = props
  return (
    <Container className={className}>
      <Nav>
        <Link to="/" className={({ isActive }) => (isActive ? 'current' : '')}>
          Full
        </Link>
        <Link to="/minimal" className={({ isActive }) => (isActive ? 'current' : '')}>
          Minimal
        </Link>
        <Link to="/atlassian" className={({ isActive }) => (isActive ? 'current' : '')}>
          Atlassian
        </Link>
        <Link to="/fullv1" className={({ isActive }) => (isActive ? 'current' : '')}>
          Full v1
        </Link>
      </Nav>
    </Container>
  )
}

const Container = styled.div`
  background: var(--color-primary);
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.18);
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
