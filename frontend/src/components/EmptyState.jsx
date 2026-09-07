function EmptyState({
  title = "No data available",
  message = "There is currently nothing to display.",
}) {
  return (
    <div className="text-center py-5">

      <div style={{ fontSize: "45px" }}>
        📭
      </div>

      <h5 className="fw-bold mt-3">
        {title}
      </h5>

      <p className="text-muted">
        {message}
      </p>

    </div>
  );
}

export default EmptyState;