<script setup>
import ModalLogin from '../components/ModalLogin.vue'
import ModalRegister from '../components/ModalRegister.vue'
</script>

<template>
    <!-- Header med meny och hero bild -->
    <header>
        <section class="hero is-primary is-small">
            <div class="hero-head  is-link">
                <nav class="navbar is-primary" aria-label="main navigation">
                    <div class="navbar-brand">
                        <RouterLink to="/"><img id="logo" alt="Rund logotyp som nästan liknar en frisbee" src="../assets/favicon.ico"></RouterLink>

                        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
                            data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" class="navbar-menu">
                        <ul class="navbar-start logged_in_shown">
                            <li>
                                <RouterLink to="/" class="navbar-item"><i class="material-icons">home</i> Start
                                </RouterLink>
                            </li>

                            <li>
                                <RouterLink to="/inventorie" class="navbar-item"><i
                                        class="material-icons">perm_contact_calendar</i> Lagret</RouterLink>
                            </li>

                            <li>
                                <RouterLink to="/profile" class="navbar-item"><i class="material-icons">info</i>
                                    Användare
                                </RouterLink>
                            </li>
                        </ul>

                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div class="buttons logged_in_hidden">
                                    <div class="">
                                        <ModalLogin />

                                        <ModalRegister />
                                    </div>

                                </div>
                                <!-- vid utloggning rensas sessionStorage och sidan laddas om -->
                                <div class="buttons logged_in_shown">
                                    <button class="button is-light logged_in_shown"
                                        onclick='sessionStorage.clear();  window.location.href = "/";'>Logga ut</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- Herotext -->
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h2 class="title">Discgolf-grossisten</h2>
                    <p class="subtitle">Sveriges största discgolf-grossist</p>
                </div>
            </div>
        </section>
    </header>
</template>

<script>

//Importerar axios för hantera fetch-anrop
import axios from 'axios';

//Export klassen
export default {

    //Vid app start hämtas sessionstorage för kontroll
    mounted() {

        const token = sessionStorage.getItem('access_token');
        //Vid ogiltig token loggas användaren ut
        if (token) {
            this.CheckToken();
        }
        else {
        }

        //Metod för att styra styling av menyn beroende på om användaren är inloggad.
        this.ChangeStyleMeny();
        //Metod för att initiera hamburgermenyn
        this.HamburgerMeny();
    },

    methods: {
        //Metod för att styra styling av menyn beroende på om användaren är inloggad.
        ChangeStyleMeny() {
            const loggedInHidden = document.querySelectorAll(".logged_in_hidden");
            const loggedInShown = document.querySelectorAll(".logged_in_shown");

            const token = sessionStorage.getItem('access_token');
            if (token) {
                loggedInHidden.forEach(element => {
                    element.style.display = "none";
                });
                loggedInShown.forEach(element => {
                    element.style.display = "flex";
                });

            } else {
                loggedInHidden.forEach(element => {
                    element.style.display = "flex";
                });
                loggedInShown.forEach(element => {
                    element.style.display = "none";
                });
            }
        },

        //Metod för att initiera hamburgermenyn
        HamburgerMeny() {
            // Läser in alla "navbar-burger" elements
            const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

            // Lägger till ett click event för var och en av dem
            $navbarBurgers.forEach(el => {
                el.addEventListener('click', () => {

                    // Hämtar target från "data-target"
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);

                    // ändrar läge på "is-active" klassen
                    el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');
                });
            });
        },

        //Metod för att kontrollera om token är giltig
        async CheckToken() {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            await axios.get('https://nest-js-discgolf-grossisten.onrender.com/auth/profile', {
                headers: headers
            })
                .then((response) => {
                })

                //Vid ogiltig token loggas användaren ut
                .catch((error) => {
                    sessionStorage.clear();
                    window.location.href = "/";
                })
        },
    }
}

</script>

<!-- Styling av punktlista -->
<style scoped>
#logo {
    border-radius: 100%;
    width: 50px;
    height: 50px;
    margin: 5px;
}
</style>
