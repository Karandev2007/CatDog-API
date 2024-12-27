const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// file serving middleware
app.use('/images/cats', express.static(path.join(__dirname, 'images', 'cats')));
app.use('/images/dogs', express.static(path.join(__dirname, 'images', 'dogs')));

// response stucture
function getImageDetails(folder, file, category) {
    const filePath = path.join(folder, file);
    const stats = fs.statSync(filePath);

    return {
        name: file,
        size: stats.size,
        url: `http://localhost:6908/images/${category}/${file}`,
    };
}

// random image select
function getRandomImage(folder, category) {
    const files = fs.readdirSync(folder).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

    if (!files.length) {
        return null;
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    return getImageDetails(folder, randomFile, category);
}

// random cat image route
app.get('/cat', (req, res) => {
    const catFolder = path.join(__dirname, 'images', 'cats');
    const randomCat = getRandomImage(catFolder, 'cats');

    if (!randomCat) {
        res.status(404).json({ error: 'No cat images found' });
    } else {
        res.json(randomCat);
    }
});

// random dog image route
app.get('/dog', (req, res) => {
    const dogFolder = path.join(__dirname, 'images', 'dogs');
    const randomDog = getRandomImage(dogFolder, 'dogs');

    if (!randomDog) {
        res.status(404).json({ error: 'No dog images found' });
    } else {
        res.json(randomDog);
    }
});

// start api on 6908 port
app.listen(6908, () => {
    console.log('api is up');
});