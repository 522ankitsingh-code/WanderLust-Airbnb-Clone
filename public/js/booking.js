const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const totalPrice = document.getElementById("totalPrice");

if (checkIn && checkOut && totalPrice) {

    function calculatePrice() {

        if (!checkIn.value || !checkOut.value) {
            totalPrice.innerHTML = pricePerNight.toLocaleString("en-IN");
            return;
        }

        const start = new Date(checkIn.value);
        const end = new Date(checkOut.value);

        const diff = end.getTime() - start.getTime();

        const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (nights <= 0) {
            totalPrice.innerHTML = pricePerNight.toLocaleString("en-IN");
            return;
        }

        totalPrice.innerHTML = (nights * pricePerNight).toLocaleString("en-IN");
    }

    checkIn.addEventListener("change", calculatePrice);
    checkOut.addEventListener("change", calculatePrice);
}