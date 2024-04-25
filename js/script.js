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
          } else if (currentSection == "Note" || currentSection == "Notes") {
            keymapSections[currentSection].push({ keymap: null, description: line });
          } else if (line.includes('->')) {
            const [keymap, description] = line.split('->').map(part => part.trim());
            keymapSections[currentSection].push({ keymap, description });
          }
        });

        // Generate HTML
        const container = document.getElementById('keymaps');
        const keymapTemplate = document.getElementById('keymap-item');
        const commandTemplate = document.getElementById('command-item');
        const noteTemplate = document.getElementById('note-item');
        const keymapSectionTemplate = document.getElementById('keymap-section');

        for (const section in keymapSections) {
          if (keymapSections[section].length == 0) {
            continue;
          }

          const keymapSectionClone = keymapSectionTemplate.content.cloneNode(true);
          const keymapSectionTile = keymapSectionClone.querySelectorAll('.title')[0];
          const keymapSectionList = keymapSectionClone.querySelectorAll('.keymap-list')[0];

          keymapSectionTile.textContent = section;

          keymapSections[section].forEach(keymap => {
            if (section == "Note" || section == "Notes") {

              const commandTemplateClone = commandTemplate.content.cloneNode(true);
              let commandDesctiption = commandTemplateClone.querySelectorAll('.description')[0];

              commandDesctiption.textContent = keymap.description;

              keymapSectionList.appendChild(commandTemplateClone);
              return;
            }
            const keymapTemplateClone = keymapTemplate.content.cloneNode(true);
            let keymapItem = keymapTemplateClone.querySelectorAll('.keymap')[0];
            let keymapDesctiption = keymapTemplateClone.querySelectorAll('.description')[0];

            if (keymap.keymap) {
              keymapItem.textContent = keymap.keymap
            }

            keymapDesctiption.textContent = keymap.description;

            keymapSectionList.appendChild(keymapTemplateClone);
          });

          container.appendChild(keymapSectionClone);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });  }

});

