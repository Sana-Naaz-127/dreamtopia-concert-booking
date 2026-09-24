const CONCERTS = [
    {
        id:"TSW",
        artist:"Taylor Swift",
        tour:"The Eras Tour",
        genre:"Pop",
        venue:"MMRDA Grounds, Mumbai",
        date:"12 Dec 2026",
        basePrice:4999
    },
    {
        id:"1DR",
        artist:"One Direction",
        tour:"Reunion Live",
        genre:"Pop",
        venue:"DY Patil Stadium, Navi Mumbai",
        date:"18 Jan 2027",
        basePrice:5999
    },
    {
        id:"BTS",
        artist:"BTS",
        tour:"Permission to Dance",
        genre:"K-Pop",
        venue:"JLN Stadium, Delhi",
        date:"02 Feb 2027",
        basePrice:7999
    },
    {
        id:"SVT",
        artist:"Seventeen",
        tour:"Follow Tour",
        genre:"K-Pop",
        venue:"JLN Indoor Stadium, Chennai",
        date:"09 Mar 2027",
        basePrice:6499
    },
    {
        id:"ARG",
        artist:"Ariana Grande",
        tour:"Eternal Sunshine Tour",
        genre:"Pop",
        venue:"MMRDA Grounds, Mumbai",
        date:"30 Nov 2026",
        basePrice:5499
    },
    {
        id:"ARJ",
        artist:"Arijit Singh",
        tour:"Live in Concert",
        genre:"Playback",
        venue:"Gachibowli Stadium, Hyderabad",
        date:"20 Dec 2026",
        basePrice:3499
    },
    {
        id:"SHG",
        artist:"Shreya Ghosal",
        tour:"Melodies of the Heart",
        genre:"Playback",
        venue:"Nehru Centre, Mumbai",
        date:"05 Jan 2027",
        basePrice:2999
    },
    {
        id:"CLP",
        artist:"Coldplay",
        tour:"Music of the Spheres",
        genre:"Rock",
        venue:"Narendra Modi Stadium, Ahmedabad",
        date:"20 Feb 2027",
        basePrice:8999
    },
    {
        id:"EDS",
        artist:"Ed Sheeran",
        tour:"Mathematics Tour",
        genre:"Acoustic",
        venue:"M. Chinnaswamy Stadium, Bengaluru",
        date:"15 Mar 2027",
        basePrice:4499
    }
];


const CATEGORIES = [
    {
        key:"standard",
        label:"Standard",
        note:"Back-block view",
        mult:1
    },
    {
        key:"premium",
        label:"Premium",
        note:"Mid-floor",
        mult:1.6
    },
    {
        key:"vip",
        label:"VIP",
        note:"Front row + pass",
        mult:2.4
    }
];


const MAX_QTY = 6;


let activeGenre = "All";
let searchTerm = "";
let bookings = [];

let modalConcert = null;
let modalCategory = CATEGORIES[0];
let modalQty = 1;


const grid = document.getElementById("concertGrid");
const resultCount = document.getElementById("resultCount");
const genreFilters = document.getElementById("genreFilters");
const searchInput = document.getElementById("searchInput");

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");

const bookingStep = document.getElementById("bookingStep");
const confirmStep = document.getElementById("confirmStep");

const categoryOptions =
    document.getElementById("categoryOptions");

const qtyValue =
    document.getElementById("qtyValue");

const qtyMinus =
    document.getElementById("qtyMinus");

const qtyPlus =
    document.getElementById("qtyPlus");

const totalPrice =
    document.getElementById("totalPrice");

const confirmBtn =
    document.getElementById("confirmBtn");

const formError =
    document.getElementById("formError");

const doneBtn =
    document.getElementById("doneBtn");

const nameInput =
    document.getElementById("nameInput");

const emailInput =
    document.getElementById("emailInput");

const phoneInput =
    document.getElementById("phoneInput");

const bookingsList =
    document.getElementById("bookingsList");

const bookingCount =
    document.getElementById("bookingCount");


function formatINR(price){
    return "₹" + Math.round(price).toLocaleString("en-IN");
}


function renderGenreFilters(){

    const genres = [
        "All",
        ...new Set(CONCERTS.map(concert => concert.genre))
    ];

    genreFilters.innerHTML = "";

    genres.forEach(genre => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "genre-chip";

        if(genre === activeGenre){
            button.classList.add("active");
        }

        button.textContent = genre;

        button.addEventListener("click", () => {

            activeGenre = genre;

            renderGenreFilters();
            renderGrid();

        });

        genreFilters.appendChild(button);

    });
}


function renderGrid(){

    const term = searchTerm.trim().toLowerCase();

    const filtered = CONCERTS.filter(concert => {

        const matchesGenre =
            activeGenre === "All" ||
            concert.genre === activeGenre;

        const matchesSearch =
            !term ||
            concert.artist.toLowerCase().includes(term) ||
            concert.venue.toLowerCase().includes(term) ||
            concert.tour.toLowerCase().includes(term);

        return matchesGenre && matchesSearch;

    });


    resultCount.textContent =
        `${filtered.length} of ${CONCERTS.length} shows`;

    grid.innerHTML = "";


    if(filtered.length === 0){

        const message =
            document.createElement("p");

        message.className = "empty-state";

        message.textContent =
            "Nothing matches that search. Try another artist or city.";

        grid.appendChild(message);

        return;
    }


    filtered.forEach(concert => {

        const card =
            document.createElement("article");

        card.className = "ticket-card";


        const number =
            String(CONCERTS.indexOf(concert) + 1)
            .padStart(2,"0");


        card.innerHTML = `

            <div class="card-art">

                <span class="card-number">
                    ${number}
                </span>

                <span class="genre-tag">
                    ${concert.genre}
                </span>

            </div>


            <div class="card-body">

                <h3>
                    ${concert.artist}
                </h3>

                <p class="card-venue">
                    ${concert.tour}
                </p>

                <p class="card-location">
                    ${concert.venue}
                </p>

                <p class="card-date">
                    ${concert.date}
                </p>


                <div class="card-tear"></div>


                <div class="card-footer">

                    <div class="price-from">

                        <span>FROM</span>

                        <strong>
                            ${formatINR(concert.basePrice)}
                        </strong>

                    </div>


                    <button
                        class="book-btn"
                        data-id="${concert.id}">
                        Book now
                    </button>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });


    grid.querySelectorAll(".book-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                openModal(button.dataset.id);

            });

        });

}


function openModal(concertId){

    modalConcert =
        CONCERTS.find(concert =>
            concert.id === concertId
        );

    modalCategory = CATEGORIES[0];

    modalQty = 1;


    document.getElementById("modalGenre")
        .textContent = modalConcert.genre;


    document.getElementById("modalArtist")
        .textContent = modalConcert.artist;


    document.getElementById("modalMeta")
        .textContent =
        `${modalConcert.tour} · ${modalConcert.venue} · ${modalConcert.date}`;


    renderCategoryOptions();


    qtyValue.textContent = modalQty;

    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";

    formError.textContent = "";


    updateTotal();


    bookingStep.hidden = false;
    confirmStep.hidden = true;

    modalOverlay.classList.add("open");
}


function closeModal(){

    modalOverlay.classList.remove("open");

}


function renderCategoryOptions(){

    categoryOptions.innerHTML = "";


    CATEGORIES.forEach(category => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "category-opt";


        if(category.key === modalCategory.key){

            button.classList.add("active");

        }


        const price =
            modalConcert.basePrice *
            category.mult;


        button.innerHTML = `

            <strong>
                ${category.label}
            </strong>

            <span>
                ${category.note} · ${formatINR(price)}
            </span>

        `;


        button.addEventListener("click", () => {

            modalCategory = category;

            renderCategoryOptions();

            updateTotal();

        });


        categoryOptions.appendChild(button);

    });

}


function updateTotal(){

    if(!modalConcert){
        return;
    }


    const total =
        modalConcert.basePrice *
        modalCategory.mult *
        modalQty;


    totalPrice.textContent =
        formatINR(total);

}


qtyMinus.addEventListener("click", () => {

    if(modalQty > 1){

        modalQty--;

        qtyValue.textContent =
            modalQty;

        updateTotal();

    }

});


qtyPlus.addEventListener("click", () => {

    if(modalQty < MAX_QTY){

        modalQty++;

        qtyValue.textContent =
            modalQty;

        updateTotal();

    }

});


modalClose.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener("click", event => {

    if(event.target === modalOverlay){

        closeModal();

    }

});


document.addEventListener("keydown", event => {

    if(
        event.key === "Escape" &&
        modalOverlay.classList.contains("open")
    ){

        closeModal();

    }

});


function validateForm(){

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const phone =
        phoneInput.value.trim();


    if(!name){

        return "Please enter your name.";

    }


    if(!/^\S+@\S+\.\S+$/.test(email)){

        return "Please enter a valid email.";

    }


    if(!/^\d{10}$/.test(phone)){

        return "Please enter a valid 10-digit phone number.";

    }


    return "";

}


function generateBookingId(){

    const random =
        Math.random()
        .toString(36)
        .substring(2,7)
        .toUpperCase();


    return `DT-${modalConcert.id}-${random}`;

}


confirmBtn.addEventListener("click", () => {

    const error =
        validateForm();


    if(error){

        formError.textContent = error;

        return;

    }


    formError.textContent = "";


    const booking = {

        bookingId:
            generateBookingId(),

        artist:
            modalConcert.artist,

        tour:
            modalConcert.tour,

        venue:
            modalConcert.venue,

        date:
            modalConcert.date,

        genre:
            modalConcert.genre,

        category:
            modalCategory.label,

        qty:
            modalQty,

        name:
            nameInput.value.trim(),

        total:
            modalConcert.basePrice *
            modalCategory.mult *
            modalQty

    };


    bookings.unshift(booking);


    document.getElementById("tGenre")
        .textContent = booking.genre;


    document.getElementById("tArtist")
        .textContent = booking.artist;


    document.getElementById("tMeta")
        .textContent =
        `${booking.tour} · ${booking.venue} · ${booking.date}`;


    document.getElementById("tName")
        .textContent = booking.name;


    document.getElementById("tCategory")
        .textContent = booking.category;


    document.getElementById("tQty")
        .textContent = booking.qty;


    document.getElementById("tTotal")
        .textContent =
        formatINR(booking.total);


    document.getElementById("tId")
        .textContent =
        booking.bookingId;


    bookingStep.hidden = true;

    confirmStep.hidden = false;


    renderBookings();

});


doneBtn.addEventListener("click", () => {

    closeModal();

    document
        .getElementById("mybookings")
        .scrollIntoView({
            behavior:"smooth"
        });

});


function renderBookings(){

    bookingCount.textContent =
        bookings.length;


    if(bookings.length === 0){

        bookingsList.innerHTML = `
            <p class="empty-state">
                No tickets yet. Book a show NOW.
            </p>
        `;

        return;

    }


    bookingsList.innerHTML = "";


    bookings.forEach(booking => {

        const stub =
            document.createElement("div");

        stub.className =
            "booking-stub";


        stub.innerHTML = `

            <div class="stub-main">

                <h4>
                    ${booking.artist} : ${booking.tour}
                </h4>

                <p class="stub-meta">
                    ${booking.venue}
                    · ${booking.date}
                    · ${booking.category}
                    × ${booking.qty}
                    · booked as ${booking.name}
                </p>

            </div>


            <div class="stub-side">

                <span>Booking ID</span>

                <strong>
                    ${booking.bookingId}
                </strong>

                <span>Total</span>

                <strong>
                    ${formatINR(booking.total)}
                </strong>

            </div>

        `;


        bookingsList.appendChild(stub);

    });

}


searchInput.addEventListener("input", event => {

    searchTerm =
        event.target.value;

    renderGrid();

});


renderGenreFilters();

renderGrid();

renderBookings();