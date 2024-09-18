

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner-border text-primary me-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <strong role="status">Loading...</strong>
    </div>
  )
}

export default Loader