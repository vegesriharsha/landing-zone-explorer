import { Component } from 'react';

// The only class component here: React offers no hook for catching render errors.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  // A new page (different resetKey) gets a fresh try.
  componentDidUpdate(prev) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="border border-rule bg-callout p-6">
        <p className="label mb-1 !text-ink">This page failed to load</p>
        <p className="text-[15px] text-muted">
          Something on this page broke. Your other pages still work. <a className="text-navy underline" href="#home">Go to the home page</a>.
        </p>
      </div>
    );
  }
}
