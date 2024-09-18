import React, { useState } from 'react';
import { Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import { summarizeText } from './services/SummarizeService';
import styles from './FileUploadModal.module.css'; // Import CSS module

const FileUploadModal = ({ isVisible, onClose, onSummarized }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        setLoading(true);
        const summary = await summarizeText(text); // Call the service function
        console.log('Summarized Text:', summary); // Print the summary to console
        setLoading(false);
        onSummarized(summary); // Pass the summary to the parent component
        onClose(); // Close the modal after uploading
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .txt file.');
    }
  };

  return (
    <Modal
      title="Upload Meeting Transcript"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      width="70%"
      className={styles.customModal} // Updated class usage for modal
    >
      {loading ? (
        <div className={styles.loadingContainer}> {/* Updated class usage for loading container */}
          <Spin size="large" />
          <p>Processing your file, please wait...</p>
        </div>
      ) : (
        <div className={styles.uploadContainer}> {/* Updated class usage for upload container */}
          <input
            type="file"
            accept=".txt"
            id="file-upload"
            className={styles.fileInput} // Updated class usage for file input
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload" className={styles.uploadButton}> {/* Updated class usage for upload button */}
            Click to Upload a .txt File
          </label>
        </div>
      )}
    </Modal>
  );
};

FileUploadModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSummarized: PropTypes.func.isRequired,
};

export default FileUploadModal;
