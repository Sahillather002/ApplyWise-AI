
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Application Error</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
            ApplyWise encountered an unexpected problem. We've logged the error and are working on it.
          </p>
          <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-xs font-mono text-red-600 dark:text-red-400 mb-8 max-w-xl overflow-auto text-left">
            {this.state.error?.message}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <RotateCcw size={18} />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    // Fix: In class components, children must be accessed from this.props
    return this.props.children;
  }
}

export default ErrorBoundary;
