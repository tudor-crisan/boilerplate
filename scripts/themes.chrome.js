const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "caramellatte",
    "abyss",
    "silk"
];

let i = 0;
const htmlElement = document.querySelector('html');

const setTheme = () => {
    const theme = themes[i];
    console.log('Current theme is: ', theme);
    htmlElement.setAttribute('data-theme', theme);
    i++
}

setTheme();

const themeInterval = setInterval(() => {
    if (i === themes.length) {
        clearInterval(themeInterval);
        return;
    }

    setTheme();
}, 3000);
