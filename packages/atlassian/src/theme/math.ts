// If a generic is used here, props can be inferred never and passed up (even with defaults)
export function add(fn: (props?: any) => number, addend: number) {
  return (props?: any) => fn(props) + addend;
}

export function subtract(fn: (props?: any) => number, subtrahend: number) {
  return (props?: any) => fn(props) - subtrahend;
}

export function multiply(fn: (props?: any) => number, factor: number) {
  return (props?: any) => fn(props) * factor;
}

export function divide(fn: (props?: any) => number, divisor: number) {
  return (props?: any) => fn(props) / divisor;
}
