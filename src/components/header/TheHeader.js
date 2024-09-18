import React, { useState, Component } from "react";
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

import { Row, Col } from "antd";

import ArticleInfoSetting from '../article-edit/ArticleInfoSetting';

import { ArticleExportContainer } from "../../containers/ArticleExportContainer";
import { ArticleEditSaveContainer } from '../../containers/ArticleEditSaveContainer';

// import { MoreButton } from "./MoreButton";
import { EditorSettingButton } from "./EditorSetting";
import { UserNavButton } from "./UserNavButton";

import FileUploadModal from './FileUploadModal';  // Import the new modal component

import styles from './Header.module.css';

const EditPageHeader = ({
  id,
  markdown,
  toggleDisplayMode,
  toggleScrollSync,
  handleUpdate,
}) => {
  const [isModalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [summarizedText, setSummarizedText] = useState('');  // State to hold summarized text

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Function to handle receiving the summarized text from the modal
  const handleSummarizedText = (summary) => {
    setSummarizedText(summary);
    handleUpdate(summary);  // Update Editor's content through parent's prop function
  };

  return (
    <Row className={styles.header} type="flex" justify="start" align="middle">
      <Col span={4} offset={4}>
        <Link to={'/'}>
          <LogoButton />
        </Link>
      </Col>
      <Col span={2} offset={6}>
        <ArticleEditSaveContainer
          id={id}
          markdown={markdown}
        />
      </Col>
      <Col span={3}>
        <button className={`${styles.magicButton}`} onClick={openModal}>
          <span className={styles.icon}>🪄</span>
          <span className={styles.sparkles}></span>
          <span className={styles.sparkles}></span>
          <span className={styles.sparkles}></span>
          <span className={styles.sparkles}></span>
          <span className={styles.sparkles}></span>
          <span className={styles.buttonText}>AI Summarize</span>
        </button>

        {/* File upload modal */}
        <FileUploadModal 
          isVisible={isModalVisible} 
          onClose={closeModal} 
          onSummarized={handleSummarizedText} // Pass the callback to the modal
        />
      </Col>
      <Col span={1}>
        <ArticleExportContainer />
      </Col>
      <Col span={1}>
        <ArticleInfoSetting />
      </Col>
      <Col span={1}>
        <EditorSettingButton
          toggleDisplayMode={toggleDisplayMode}
          toggleScrollSync={toggleScrollSync}
        />
      </Col>
      <Col span={1}>
        <UserNavButton />
      </Col>
    </Row>
  );
};

class GeneralHeader extends Component {
  render() {
    return (
      <Row className={styles.header} type="flex" justify="start" align="middle">
        <Col span={4} offset={4}>
          <Link to={'/'}>
            <LogoButton/>
          </Link>
        </Col>
        {/*<Col span={1} offset={10}>*/}
          {/*<MoreButton/>*/}
        {/*</Col>*/}
        {/*<Col span={1}>*/}
        {/*<NavButton/>*/}
        {/*</Col>*/}
        <Col span={1} offset={11}>
          <UserNavButton/>
        </Col>
      </Row>
    );
  }
}

const LogoButton = () => (
  <button className={styles.logo}>
    Write Down
  </button>
);

EditPageHeader.propTypes = {
  toggleScrollSync: PropTypes.func.isRequired,
  toggleDisplayMode: PropTypes.func.isRequired,
};

export {
  EditPageHeader,
  GeneralHeader
};