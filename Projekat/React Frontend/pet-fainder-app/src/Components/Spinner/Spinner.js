import './Spinner.css'; // Import CSS for spinner styling

// LoadingOverlay component
const LoadingOverlay = () => {

    // alert("Loading")
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  };

  export default LoadingOverlay;