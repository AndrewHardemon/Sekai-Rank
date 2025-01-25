function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function myMain() {
    try{
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log(data);
        document.getElementById('fivehundred').textContent = numberWithCommas(data[0][2]);
        document.getElementById('thousand').textContent = numberWithCommas(data[1][2]);   
    } catch(e){
        console.log(e)
    }
}

(async () => {
    await myMain();
    setInterval(() => myMain, 30 * 1000);
})();
