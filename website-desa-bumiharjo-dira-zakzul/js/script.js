// =========================
// NAVBAR SHADOW
// =========================

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("shadow");
    } else {
        navbar.classList.remove("shadow");
    }

});

// =========================
// BUTTON SCROLL TO TOP
// =========================

const btnTop = document.getElementById("btnTop");

if (btnTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {
            btnTop.style.display = "flex";
        } else {
            btnTop.style.display = "none";
        }

    });

    btnTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// =========================
// SCROLL ANIMATION
// =========================

const fadeElements = document.querySelectorAll(".fade-up");

if (fadeElements.length > 0) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    });

    fadeElements.forEach(el => {

        observer.observe(el);

    });

}

// =========================
// COUNTER ANIMATION
// =========================

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target = parseInt(counter.innerText);

    let current = 0;

    const updateCounter = () => {

        current += Math.ceil(target / 80);

        if (current > target) {
            current = target;
        }

        counter.innerText = current;

        if (current < target) {
            requestAnimationFrame(updateCounter);
        }

    };

    updateCounter();

});

// =========================
// SEARCH UMKM
// =========================

const searchInput = document.getElementById("searchUMKM");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const keyword =
            searchInput.value.toLowerCase();

        document
            .querySelectorAll(".umkm-item")
            .forEach(item => {

                const text =
                    item.innerText.toLowerCase();

                if (text.includes(keyword)) {

                    item.style.display = "block";

                } else {

                    item.style.display = "none";

                }

            });

    });

}

// =========================
// LIGHTBOX GALERI SEDERHANA
// =========================

document.querySelectorAll(".gallery-img").forEach(img => {

    img.addEventListener("click", () => {

        window.open(img.src, "_blank");

    });

});