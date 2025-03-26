import { Component, ErrorInfo, ReactNode } from "react";
import ErrorCmp from "./components/Error";

type TProps = {
  children?: ReactNode;
};

type TState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = { hasError: false };
  }


  static getDerivedStateFromError(): TState {
    //update our state when an error occures
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorCmp
          text="An unexpected error has occured"
          btnText="Refresh"
          btnAction={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}
