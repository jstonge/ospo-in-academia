/**
 * Utility functions for handling academic references in markdown content
 */

/**
 * Process markdown text to remove reference markers
 * @param {string} content - The markdown content
 * @param {Array} references - Array of reference objects
 * @returns {string} - Processed markdown without reference markers
 */
export function processContent(content, references) {
  if (!content) {
    return ""; // Return empty string if content is undefined or null
  }
  
  // Safely remove reference markers to avoid them showing up in the rendered markdown
  return content.replace(/\[\^(\d+)\]/g, '');
}

/**
 * Insert reference markers into the rendered HTML
 * This should be called after the component is mounted
 */
export function insertReferenceMarkers() {
  // Run this in the browser only
  if (typeof document === 'undefined') return;
  
  // Wait until DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processAllReferences);
  } else {
    processAllReferences();
  }
}

/**
 * Process all references in the document
 */
function processAllReferences() {
  // Get all the sections with markdown content
  document.querySelectorAll('.content-section p').forEach(paragraph => {
    if (!paragraph || !paragraph.textContent) return;
    
    // Check if paragraph contains a footnote pattern [^1]
    const text = paragraph.textContent;
    const matches = text.match(/\[\^(\d+)\]/g);
    
    if (matches) {
      matches.forEach(match => {
        // Extract the reference number
        const refId = match.replace('[^', '').replace(']', '');
        
        // Replace the marker with a superscript
        const html = paragraph.innerHTML.replace(
          match,
          `<sup class="ref-marker"><a href="#ref-${refId}" id="ref-src-${refId}">[${refId}]</a></sup>`
        );
        
        paragraph.innerHTML = html;
      });
    }
  });
}

/**
 * Get all references for a group of sections
 * @param {Object} group - Group containing sections
 * @returns {Array} - Sorted array of reference objects
 */
export function getGroupReferences(group) {
  if (!group || !group.sections) {
    return [];
  }
  
  const allRefs = [];
  group.sections.forEach(section => {
    if (section.references && section.references.length > 0) {
      allRefs.push(...section.references);
    }
  });
  
  // Sort references by id
  return allRefs.sort((a, b) => parseInt(a.id) - parseInt(b.id));
}
