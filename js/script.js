document.addEventListener("DOMContentLoaded", function() {

  function handleThemeColor() {

  }

  const url = 'https://raw.githubusercontent.com/DannickBedard/mySetup.nvim/main/README.md';

  getCurrentKeymaps();
  function getCurrentKeymaps() {
    fetchGithubReadme();
  }

  function fetchGithubReadme() {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        const keymapSections = {};
        let currentSection = "";

        // Regular expression to match sections
        const sectionRegex = /^##\s(.+)/;

        // Splitting content by lines
        const lines = data.split('\n');

        lines.forEach(line => {
          const sectionMatch = sectionRegex.exec(line);
          if (sectionMatch) {
            currentSection = sectionMatch[1];
            keymapSections[currentSection] = [];
          } else if (line.includes('->')) {
            const [keymap, description] = line.split('->').map(part => part.trim());
            keymapSections[currentSection].push({ keymap, description });
          } else if (currentSection == "Note" || currentSection == "Notes") {
            console.log("ici1");
            keymapSections[currentSection].push({ keymap: null, description: line });
          }
        });

        // Generate HTML
        const container = document.getElementById('keymaps');

        for (const section in keymapSections) {
          if (keymapSections[section].length == 0) {
            continue;
          }

          const sectionWrapper = document.createElement('div');
          sectionWrapper.classList.add('section-wrapper');

          const sectionHeading = document.createElement('h2');
          sectionHeading.textContent = section;
          sectionWrapper.appendChild(sectionHeading);

          const keymapList = document.createElement('ul');
          keymapList.classList.add('keymap-list');

          keymapSections[section].forEach(keymap => {
            const listItem = document.createElement('li');
            listItem.classList.add('keymap-item');
            
            const keymapText = document.createElement('span');
            if (keymap.keymap) {
              keymapText.classList.add('keymap');
              keymapText.textContent = keymap.keymap;
            }

            const descriptionText = document.createElement('span');
            descriptionText.classList.add('description');
            descriptionText.textContent = keymap.description;

            listItem.appendChild(keymapText);
            listItem.appendChild(descriptionText);
            keymapList.appendChild(listItem);
          });

          sectionWrapper.appendChild(keymapList);
          container.appendChild(sectionWrapper);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });  }

});

