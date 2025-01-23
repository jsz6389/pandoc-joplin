import joplin from 'api';
import { MenuItemLocation } from 'api/types';
import { execSync } from 'child_process';
const fs = require('fs');

joplin.plugins.register({
	onStart: async function() {
		
		console.info('Started Pandoc Joplin');

		await joplin.commands.register({
			name: 'pandocMW',
			label: 'Export to Media Wiki',
			iconName: 'fas fa-music',
			execute: async () => {
				console.info(process.env.PATH);
				// Get contents of current note
				const note = await joplin.workspace.selectedNote();
				console.info(note);

				fs.writeFileSync('.temp.md', note.body);

				try {
					const output = execSync('pandoc .temp.md -t mediawiki -o "'+note.title+'.mw"', { encoding: 'utf-8' });
					console.info(output);
				} catch (error) {
					console.error('Error:', error);
				}
				return Promise.resolve();
			},
		});
		joplin.views.menuItems.create('pandocMW', 'pandocMW', MenuItemLocation.Edit, {accelerator: null});
	},
});
