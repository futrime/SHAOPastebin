# Shao-Pastebin

SHAO Pastebin is a web app for storing and sharing any text online. This kind of websites are mainly used by programmers to share their code snippets, but anyone is welcome to paste any text.

## Features

* Fast
* Simple and lightweight
* Splitted frontend and backend
* Support Markdown
* Free and easy to deploy

## Getting Started

### Our Service

Don't you want to deploy on your own? Just visit [our website](https://pastebin.futrime.com) to use our public service!

### Server

#### Prerequisite
* A [SendGrid](https://sendgrid.com/) account (free account is OK)
* PHP version 7.0 or greater
* MySQL version 5.6 or greater (or any other compatible database)

#### Deployment
1. Register at [SendGrid](https://sendgrid.com/) and get the key for email sending
1. Create a MySQL compatible database
1. Import `/backend/pastebin.sql` to the database created
1. Modify configurations in `/backend/config.php` according to comments in the file
1. Upload all files except `/backend/pastebin.sql` in `/backend/` folder to your server

### Client

#### Prerequisite
* A SHAO-Pastebin server (you can use our server `https://api.paste.shao.fun` or `https://api.pastebin.594144.xyz` to test)
* A server to hold client program (you can run locally) or deployment services like Netlify and GitHub Pages
* For running locally, Node.js >= 12.x and npm >= 6.x is recommended

#### Deployment
You can run it locally by typing `npm test`. Then you can visit [localhost:8080](http://localhost:8080) to have a glance.

Meanwhile, you can set up a traditional web server like nginx and Caddy. And upload all files in root folder except `/backend/`.

We **RECOMMEND** deploying with GitHub Pages, for the best experience and the most reliability:
1. Fork this repository
1. Switch to branch `pages`
1. Modify the backend URL configuration in `/config.json`
1. Stash and commit the changes
1. Set up GitHub Pages:
    1. Visit your forked repository on GitHub
    1. Go to `Settings`->`Pages`
    1. Select source branch `pages` and folder `/ (root)` and save
    1. You can also add your custom domain

## License
SHAO Pastebin is released under Apache-2.0 License. See [the LICENSE file](https://github.com/Futrime/SHAO-Pastebin/blob/master/LICENSE) for more details