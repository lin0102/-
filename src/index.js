import print from './print';
import './style/style.css';
import './style/style.scss';

function timeout(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

asyncPrint("hello,world", 5000);

print('28888888');

