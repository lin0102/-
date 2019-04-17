function print(str) {
    const h1 = document.createElement('h1');
    h1.innerText = str;
    document.body.appendChild(h1);
}

export default print;