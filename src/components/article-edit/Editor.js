import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import 'codemirror/mode/gfm/gfm.js';
import "codemirror/addon/selection/active-line";
import 'codemirror/lib/codemirror.css';
import './theme/cherry.css';
import PropTypes from "prop-types";
import {message, Alert} from 'antd';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        mode: 'gfm',
        theme: 'cherry',
        tabSize: 2,
        styleActiveLine: true,
        lineWrapping: true,
      },
    };
  }

  // This callback is used to get the CodeMirror instance
  editorDidMount = (editor) => {
    this.editor = editor;
  };

  updateContent = (newContent) => {
    this.props.handleUpdate(null, null, newContent);
  };

  applyFormatting = (prefix, suffix) => {
    if (this.editor) {
      const selectedText = this.editor.getSelection();
  
      if (selectedText) {
        const fullText = this.editor.getValue();
        const startPos = this.editor.indexFromPos(this.editor.getCursor("start"));
        const endPos = this.editor.indexFromPos(this.editor.getCursor("end"));
  
        const beforeSelected = fullText.slice(startPos - prefix.length, startPos);
        const afterSelected = fullText.slice(endPos, endPos + suffix.length);
  
        // Check if the selection is already formatted
        const hasFormatting = beforeSelected === prefix && afterSelected === suffix;
  
        let newText;
        if (hasFormatting) {
          // Remove formatting: remove prefix and suffix without altering selectedText
          const unformattedText = fullText.slice(startPos, endPos);
          this.editor.replaceRange(
            unformattedText, 
            this.editor.posFromIndex(startPos - prefix.length), 
            this.editor.posFromIndex(endPos + suffix.length)
          );
        } else {
          // Apply formatting: add prefix and suffix around selectedText
          newText = `${prefix}${selectedText}${suffix}`;
          this.editor.replaceSelection(newText);
        }
  
        this.editor.focus();
      }
    }
  };
  
  

  handleBold = () => {
    this.applyFormatting('**', '**');
  };

  handleItalic = () => {
    this.applyFormatting('_', '_');
  };

  // Updated handleHeading function to handle partial paragraph selection
  handleHeading = (level) => {
    if (this.editor) {
      const selectedText = this.editor.getSelection();
      const cursorStart = this.editor.getCursor("start");
      const cursorEnd = this.editor.getCursor("end");
  
      // Get the full line content for the start and end of selection
      const startLine = this.editor.getLine(cursorStart.line);
      const endLine = this.editor.getLine(cursorEnd.line);
  
      // Check if the selection spans the entire paragraph (entire line)
      const isFullParagraphSelection = 
        selectedText.trim() === startLine.trim() && 
        (cursorStart.line === cursorEnd.line ? selectedText.trim() === endLine.trim() : true);
  
      if (isFullParagraphSelection) {
        // Apply heading formatting if the entire paragraph is selected
        this.applyFormatting('#'.repeat(level) + ' ', '');
      } else {
        // Show error if only part of the paragraph is selected
        message.error('Word in paragraph or sentence can\'t be formatted as heading.');
      }
    }
  };


handleList = (type) => {
  if (this.editor) {
    const selectedText = this.editor.getSelection();

    if (selectedText.trim()) {
      const paragraphs = selectedText.split('\n').filter(paragraph => paragraph.trim()); // Split by newlines and filter non-empty paragraphs

      // Check if selected text is part of a paragraph (i.e., no newline in the selection and part of a single paragraph)
      const selectedLines = selectedText.split('\n').map(line => line.trim());
      const editorText = this.editor.getValue();
      const selectedRange = this.editor.listSelections()[0];

      // Find if the entire paragraph is selected or just part of it
      const startLine = this.editor.getLine(selectedRange.head.line);
      const endLine = this.editor.getLine(selectedRange.anchor.line);
      
      const isFullParagraphSelected = selectedLines.length === 1 && selectedText.trim() === startLine.trim() && selectedText.trim() === endLine.trim();
      
      if (!isFullParagraphSelected && paragraphs.length === 1) {
        // If only part of a single paragraph is selected
        message.error('Please select the entire paragraph to apply list formatting.');
        return;
      }

      let formattedParagraphs;

      if (type === 'ordered') {
        // Check if the selected text is already ordered (starts with "1. ", "2. ", etc.)
        const isOrderedList = paragraphs.every(paragraph => /^\d+\.\s/.test(paragraph.trim()));

        if (isOrderedList) {
          // If it's already an ordered list, remove the numbering
          formattedParagraphs = paragraphs.map(paragraph => paragraph.replace(/^\d+\.\s*/, '').trim());
        } else {
          // Apply ordered list numbering (1. 2. 3. ...)
          formattedParagraphs = paragraphs.map((paragraph, index) => `${index + 1}. ${paragraph.trim()}`);
        }

      } else if (type === 'unordered') {
        // Check if the selected text is already unordered (starts with "* " or "- ")
        const isUnorderedList = paragraphs.every(paragraph => /^(\*|\-)\s/.test(paragraph.trim()));

        if (isUnorderedList) {
          // If it's already an unordered list, remove the bullet points
          formattedParagraphs = paragraphs.map(paragraph => paragraph.replace(/^(\*|\-)\s*/, '').trim());
        } else {
          // Apply unordered list bullet points (default to "* ")
          formattedParagraphs = paragraphs.map(paragraph => `* ${paragraph.trim()}`);
        }
      }

      // Replace the selection with the formatted paragraphs
      const formattedText = formattedParagraphs.join('\n');
      this.editor.replaceSelection(formattedText);
      this.editor.focus();
    }
  }
};


  handleLink = () => {
    this.applyFormatting('[', '](URL)');
  };

  handleImage = () => {
    if (this.editor) {
      const selectedText = this.editor.getSelection();
      const altText = selectedText ? selectedText : 'alt text';
      const imageSyntax = `![${altText}](URL)`;
      
      this.editor.replaceSelection(imageSyntax);
      this.editor.focus();
    }
  };
  

  handleBlockquote = () => {
    this.applyFormatting('> ', '');
  };

  handleCode = () => {
    this.applyFormatting('`', '`');
  };

  handleCodeBlock = () => {
    if (this.editor) {
      const selectedText = this.editor.getSelection();
  
      // Always add a new line before and after the selected text
      const newText = `\`\`\`\n${selectedText}\n\`\`\``;
  
      // Replace the selected text with the formatted code block
      this.editor.replaceSelection(newText);
      this.editor.focus();
    }
  };
  

  handleHorizontalRule = () => {
    if(this.editor){
      this.editor.replaceSelection(this.editor.getSelection() + "---");
    }
  };

  handleStrikethrough = () => {
    this.applyFormatting('~~', '~~');
  };


  handleSubscript = () => {
    this.applyFormatting('~', '~');
  };
  
  handleSuperscript = () => {
    this.applyFormatting('^', '^');
  };
  

  handleHTML = () => {
    if(this.editor){
      this.editor.replaceSelection("<div>" + this.editor.getSelection() + "</div>");
    }
  };

  render() {
    return (
      <div>
          <div
            style={{
              position: 'fixed',
              top: '70px', // Positioned below notice
              left: this.props.displayMode === "Editor Only" ? '50%' : '0', 
              width: this.props.displayMode === "Editor Only" ? '75%' : '50%',
              margin: this.props.displayMode === "Editor Only" ? '0' : '', 
              transform: this.props.displayMode === "Editor Only" ? 'translateX(-50%)' : 'none',
              background: '#ddd', 
              padding: '10px', 
              zIndex: 2
            }}
          >
          <button onClick={this.handleBold}><i className="fas fa-bold"></i></button>
          <button onClick={this.handleItalic}><i className="fas fa-italic"></i></button>
          <button onClick={() => this.handleHeading(1)}><i className="fas fa-heading"></i> H1</button>
          <button onClick={() => this.handleHeading(2)}><i className="fas fa-heading"></i> H2</button>
          <button onClick={() => this.handleHeading(3)}><i className="fas fa-heading"></i> H3</button>
          <button onClick={() => this.handleHeading(4)}><i className="fas fa-heading"></i> H4</button>
          <button onClick={() => this.handleHeading(5)}><i className="fas fa-heading"></i> H5</button>
          <button onClick={() => this.handleHeading(6)}><i className="fas fa-heading"></i> H6</button>
          <button onClick={() => this.handleList('unordered')}><i className="fas fa-list-ul"></i></button>
          <button onClick={() => this.handleList('ordered')}><i className="fas fa-list-ol"></i></button>
          <button onClick={this.handleLink}><i className="fas fa-link"></i></button>
          <button onClick={this.handleImage}><i className="fas fa-image"></i></button>
          <button onClick={this.handleBlockquote}><i className="fas fa-quote-left"></i></button>
          <button onClick={this.handleCode}><i className="fas fa-code"></i></button>
          <button onClick={this.handleCodeBlock}><i className="fas fa-code-branch"></i></button>
          <button onClick={this.handleHorizontalRule}><i className="fas fa-minus"></i></button>
          <button onClick={this.handleStrikethrough}><i className="fas fa-strikethrough"></i></button>
          <button onClick={this.handleSubscript}><i className="fas fa-subscript"></i></button>
          <button onClick={this.handleSuperscript}><i className="fas fa-superscript"></i></button>
          <button onClick={this.handleHTML}><i className="fas fa-code"></i> HTML</button>
        </div>
        <CodeMirror
          value={this.props.value}
          options={this.state.options}
          onBeforeChange={this.props.handleUpdate}
          onChange={(editor, data, value) => {}}
          editorDidMount={this.editorDidMount}
        />
      </div>
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  handleUpdate: PropTypes.func
};

export default Editor;
