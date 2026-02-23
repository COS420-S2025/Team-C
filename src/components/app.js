/**
 * Creates a button with the given name and colors.
 *
 * @param {Object} options
 * @param {string} options.name - Text shown on the button
 * @param {string} [options.textColor] - Color of the button text (e.g. '#fff' or 'white')
 * @param {string} [options.backgroundColor] - Button background color (e.g. '#333')
 * @param {string} [options.activeColor] - Button background color when clicked (e.g. '#555')
 * @returns {HTMLButtonElement}
 */
function createButton(options) {
  var name = options.name || 'Button';
  var textColor = options.textColor;
  var backgroundColor = options.backgroundColor;
  var activeColor = options.activeColor;

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'app-button';
  button.textContent = name;

  if (textColor) button.style.setProperty('--btn-text-color', textColor);
  if (backgroundColor) button.style.setProperty('--btn-bg', backgroundColor);
  if (activeColor) button.style.setProperty('--btn-active-bg', activeColor);

  return button;
}

// --- App: add the button to the page ---
(function () {
  var container = document.getElementById('button-container');
  if (!container) return;

  var button = createButton({
    name: 'Test Button',
    textColor: '#1a1a2e',
    backgroundColor: '#eee',
    activeColor: '#ccc'
  });

  container.appendChild(button);
})();
