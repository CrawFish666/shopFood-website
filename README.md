# shopFood-website v 1.0.0
Simple fitness food [website](https://crawfish666.github.io/shopFood-website/)
## Features
1. Modal dialog with feedback form which optional open after scroll to bottom/timer and close by keyboard button, press cross on modal, click past the modal
2. Tab's slider
3. Simple swiper slider
4. Simple activity calories calculator
5. Feedback form with phone and name mask which is sent to DB. Feedback form after send can create new modal window with you're message when loading/success/failure send or default message and optional you can use you're old modal window which can close after timer or click cross on modal or click past the modal
6. Simple promotion timer
## What's new?
$${\color{green}v1.0.0}$$
```
1. Add modal dialog
2. Add tab's slider
3. Add swiper slider
4. Add activity calories calculator
5. Add feedback form
6. Add promotion timer
7. Menu cards loading from DB
```
## What's next?
- [ ] Refactoring html and css because html markup is poor
- [ ] Remake pictures(svg, jpg and other)
- [ ] Make adaptive website for phone, tablet, notebooks and other size's
- [ ] Refactoring feedbackForm module
- [ ] Add name validation and error handler. If we got error add message error under input's fileds
- [ ] Add multi language with i18n or other custom libraries. Language will be save in localstorage if he didnt have language take it from ip adress
## Installation
1. clone repo
```
git clone git@github.com:CrawFish666/shopFood-website.git
```
2. install npm dependensies
```
npm install
```
3. Create file .env in main folder
```
SERVER_URL="You're DB link with menu card's and which will be sending feedback form"
```
4. build project
```
npm run build
```

## License
Copyright (c) 2023 [CrawFish666](https://github.com/CrawFish666) Released under the [MIT license](https://opensource.org/license/mit/)
