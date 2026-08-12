import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-center text-sm font-bold w-full h-full flex flex-col items-center justify-center">
          Oops! The chart couldn't load on this device.
          <br/>
          <button 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full active:scale-95 transition-transform"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
