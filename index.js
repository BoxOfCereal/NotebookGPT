const fs = require('fs');

function convertToBookmarklet(filePath) {
  try {
    // Read the JavaScript file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Remove line breaks and whitespace from the JavaScript code
    const sanitizedCode = fileContents.replace(/[\r\n\s]+/g, '');
    
    // Encode the JavaScript code as a bookmarklet string
    const bookmarklet = `javascript:${encodeURIComponent(sanitizedCode)}`;

    return bookmarklet;
  } catch (error) {
    console.error('Error:', error);
  }
}

function updateBookmarkletInMarkdown(filePath, newBookmarklet) {
  try {
    // Read the Markdown file
    let markdownContent = fs.readFileSync(filePath, 'utf8');
    
    // Search for the existing bookmarklet string
    const regex = /(?<=<a\s+href="javascript:)[^"]*(?=">)/g;
    const existingBookmarklet = regex.exec(markdownContent)[0];
    
    // Replace the existing bookmarklet string with the new one
    markdownContent = markdownContent.replace(existingBookmarklet, newBookmarklet);
    
    // Write the updated Markdown file
    fs.writeFileSync(filePath, markdownContent, 'utf8');
    
    console.log('Markdown file updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage example
const mdFilePath = './README.md';
const bookmarkletPath = './bookmarklet.js';
const newBookmarklet = convertToBookmarklet(bookmarkletPath);
updateBookmarkletInMarkdown(mdFP, newBookmarklet);
