function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="alert alert-danger text-center">

      <h5 className="fw-bold">
        ⚠️ Unable to load data
      </h5>

      <p className="mb-0">
        {message}
      </p>

    </div>
  );
}

export default ErrorState;