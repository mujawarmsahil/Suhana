import { Component } from "react";
import SceneFallback from "./SceneFallback.jsx";

export default class SceneErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <SceneFallback />;
    return this.props.children;
  }
}
