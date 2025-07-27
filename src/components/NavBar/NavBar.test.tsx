import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { NavBar } from './NavBar';

const renderComponent = () => {
  return render(<NavBar />);
};

describe('NavBar component', () => {
  beforeEach(() => {});

  it('should render component', () => {
    const component = renderComponent();

    expect(component.baseElement).toBeInTheDocument();
  });
});
