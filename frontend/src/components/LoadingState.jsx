function LoadingState() {
  return (
    <div className="text-center py-5">

      <div
        className="spinner-border text-primary mb-3"
        role="status"
      />

      <h5>Loading campus intelligence...</h5>

      <p className="text-muted">
        Fetching the latest campus issue data.
      </p>

    </div>
  );
}

export default LoadingState;