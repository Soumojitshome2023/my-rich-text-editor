import React, { useRef, useState } from 'react';
import './App.css';

const RichTextEditor = () => {
  const editorRef = useRef(null);
  const [showTablePopup, setShowTablePopup] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [imageUrl, setImageUrl] = useState('');
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [imgWidth, setImgWidth] = useState('');
  const [imgHeight, setImgHeight] = useState('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);


  // ======================= Insert HTML =======================
  const insertHTML = (html) => {
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents(); // Remove selected content

    // Create a temporary container to hold the new HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const frag = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      frag.appendChild(tempDiv.firstChild);
    }

    // Insert content only if frag has elements
    if (frag.childNodes.length > 0) {
      const lastNode = frag.lastChild;
      range.insertNode(frag);

      // Move cursor after the last inserted node
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };


  const handleCommand = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
  };



  // ======================= Insert Table =======================
  const handleTableInsert = () => {
    let tableHtml = '<table border="1" style="width:100%; border-collapse: collapse; margin: 10px 0;">';
    for (let i = 0; i < rows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHtml += `<td style="padding: 8px; border: 1px solid #ddd;">Cell ${i + 1}-${j + 1}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    insertHTML(tableHtml);
    setShowTablePopup(false);
  };



  // ======================= Insert Img =======================
  const handleImageInsert = () => {
    if (!imageUrl.trim()) {
      setShowImagePopup(false);
      return; // Prevent inserting empty images
    }

    let style = "";
    if (imgWidth) style += `width:${imgWidth}px;`;
    if (imgHeight && !keepAspectRatio) style += `height:${imgHeight}px;`;

    const imgTag = `<img src="${imageUrl}" alt="Inserted image" style="${style}">`;
    insertHTML(imgTag);

    setShowImagePopup(false);
    setImageUrl(""); // Reset URL input
    setImgWidth(""); // Reset width
    setImgHeight(""); // Reset height
  };


  // ======================= Insert Link =======================
  const handleLinkInsert = () => {
    if (!linkUrl) {
      setShowLinkPopup(false);
      return;
    }

    // Generate the HTML for the anchor tag
    const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;

    // Insert the link HTML into the editor using insertHTML
    insertHTML(linkHTML);

    // Reset states and close the popup after inserting the link
    setShowLinkPopup(false);
    setLinkUrl(''); // Clear the link URL input
    setLinkText(''); // Clear the link text input
  };





  const handleFontSizeChange = (e) => {
    handleCommand('fontSize', 7); // Reset to default size
    handleCommand('fontSize', e.target.value);
  };

  const handleTextColorChange = (e) => {
    handleCommand('foreColor', e.target.value);
  };

  const handleBgColorChange = (e) => {
    handleCommand('hiliteColor', e.target.value);
  };

  const handleFontFamilyChange = (e) => {
    const fontFamily = e.target.value;
    handleCommand('fontName', fontFamily);
  };


  return (
    <div className="rich-text-editor-container">
      <div className="toolbar">
        {/* Basic formatting */}
        <button onClick={() => handleCommand('bold')} title="Bold (Ctrl+B)"><b>B</b></button>
        <button onClick={() => handleCommand('italic')} title="Italic (Ctrl+I)"><i>I</i></button>
        <button onClick={() => handleCommand('underline')} title="Underline (Ctrl+U)"><u>U</u></button>
        <button onClick={() => handleCommand('strikeThrough')} title="Strikethrough"><s>S</s></button>

        {/* Text alignment */}
        <button onClick={() => handleCommand('justifyLeft')} title="Align Left">≡</button>
        <button onClick={() => handleCommand('justifyCenter')} title="Align Center">≡</button>
        <button onClick={() => handleCommand('justifyRight')} title="Align Right">≡</button>

        {/* Lists */}
        <button onClick={() => handleCommand('insertOrderedList')} title="Numbered List">OL</button>
        <button onClick={() => handleCommand('insertUnorderedList')} title="Bulleted List">UL</button>

        {/* select font family  */}
        <select onChange={handleFontFamilyChange} title="Font Family">
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Impact">Impact</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
        </select>


        {/* Font size */}
        <select onChange={handleFontSizeChange} defaultValue="3" title="Font Size">
          <option value="1">8px (Tiny)</option>
          <option value="2">10px (Small)</option>
          <option value="3">12px (Normal)</option>
          <option value="4">14px (Medium)</option>
          <option value="5">18px (Large)</option>
          <option value="6">24px (Extra Large)</option>
          <option value="7">36px (Huge)</option>
          <option value="8">48px (Giant)</option>
          <option value="9">72px (Massive)</option>
        </select>

        {/* Colors */}
        <input type="color" onChange={handleTextColorChange} title="Text Color" />
        <input type="color" onChange={handleBgColorChange} title="Background Color" />

        {/* Special formatting */}
        <button onClick={() => handleCommand('formatBlock', 'blockquote')} title="Blockquote">❝</button>
        <button onClick={() => handleCommand('subscript')} title="Subscript">X₂</button>
        <button onClick={() => handleCommand('superscript')} title="Superscript">X²</button>

        {/* Insert elements */}
        <button onClick={() => setShowTablePopup(true)} title="Insert Table">Table</button>
        <button onClick={() => setShowImagePopup(true)} title="Insert Image">Image</button>
        <button onClick={() => setShowLinkPopup(true)} title="Insert Link">Link</button>
        <button onClick={() => handleCommand('insertHorizontalRule')} title="Horizontal Line">―</button>

        {/* Other actions */}
        <button onClick={() => handleCommand('undo')} title="Undo (Ctrl+Z)">↩</button>
        <button onClick={() => handleCommand('redo')} title="Redo (Ctrl+Y)">↪</button>
        <button onClick={() => handleCommand('removeFormat')} title="Clear Formatting">✕</button>
      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable
        spellCheck="true"
      ></div>

      {/* Table Insert Popup */}
      {showTablePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Insert Table</h3>
            <div className="form-group">
              <label>Rows:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(10, parseInt(e.target.value) || 3)))}
              />
            </div>
            <div className="form-group">
              <label>Columns:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, parseInt(e.target.value) || 3)))}
              />
            </div>
            <div className="popup-buttons">
              <button onClick={handleTableInsert}>Insert</button>
              <button onClick={() => setShowTablePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Insert Popup */}
      {showImagePopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Insert Image</h3>
            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Width (px):</label>
              <input
                type="number"
                value={imgWidth}
                onChange={(e) => setImgWidth(e.target.value)}
                placeholder="Auto"
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Height (px):</label>
              <input
                type="number"
                value={imgHeight}
                onChange={(e) => setImgHeight(e.target.value)}
                placeholder="Auto"
                min="1"
              />
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="keepAspect"
                checked={keepAspectRatio}
                onChange={(e) => setKeepAspectRatio(e.target.checked)}
              />
              <label htmlFor="keepAspect">Maintain aspect ratio</label>
            </div>
            <div className="popup-buttons">
              <button onClick={handleImageInsert}>Insert</button>
              <button onClick={() => setShowImagePopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Link Insert Popup */}
      {showLinkPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Insert Link</h3>
            <div className="form-group">
              <label>URL:</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Text to display (optional):</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Leave blank to use URL or selected text"
              />
            </div>
            <div className="popup-buttons">
              <button onClick={handleLinkInsert}>Insert</button>
              <button onClick={() => setShowLinkPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;