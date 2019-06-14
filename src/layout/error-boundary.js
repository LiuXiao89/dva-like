import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    // can upload error
    console.warn(error);
    return {hasError: true};
  }

  render() {
    console.log('render error');
    const {hasError, err} = this.state;

    if (hasError) {
      return (
        <div>
          <h1>哦豁, 崩溃老</h1>

          <p>原因: {err}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
