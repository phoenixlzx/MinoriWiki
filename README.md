# MinoriWiki

![MinoriWiki](https://raw.githubusercontent.com/phoenixlzx/MinoriWiki/c1be1e77d6f48607fd60be4727b96a18ca7d648a/misc/minori-note.jpg)

MinoriWiki is a static Wiki site Generator

**Currently under development - PRs welcome**

### Usage

1. Install via NPM: `npm install minori -g`
2. Create an empty directory
3. `minori init`
4. Edit `config.yml` to fit your needs
5. Use `minori note [filename]` to create new note or edit existing one
6. Deploy your files generated under site directory (Default to `wiki`) to production environment

* `source` (defaults to `notes`) directory contains all note markdown files
* `static` (defaults to `static`) directory will be copied to `site` directory, you could store any static files that may be used in your wiki site.
* `site` (defaults to `wiki`) directory contains generated site files.

### Theme

Theme is customizable. Theme directory should contain:

* `assets` directory to store style sheets, scripts, fonts, etc.
* `index.ejs` is the homepage template.
* `page.ejs` is the post page template.

The following variables are passed to EJS:

* `config` - the parsed `config.yml` object
* `categories` - Array of category object:
```
[
	{
		"name": "uncategoried",
		"pages": [
			{
				"title": "page title",
				"link": "page-file-name",
				"category": "uncategoried",
				"content": "parsed html"
			},
			...
		]
	},
	...
]
```
* `page` - `{}` in homepage and the specified page object in post page.

### License

MIT.
