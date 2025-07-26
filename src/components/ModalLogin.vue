<script setup="js"></script>
<template>
    <!-- Modal för registrering av användare med formulär och apianrop -->
    <button class="js-modal-trigger button is-light mr-2" data-target="modal-js-login">
        Logga in
    </button>


    <section id="modal-js-login" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">


            <div class="modal-card-head">
                <h2 class="modal-card-title">Logga in</h2>
                <button class="delete" aria-label="close"></button>
            </div>
            <form class="modal-card-body">


                <div class="field">
                    <label class="label">Email</label>
                    <p class="control">
                        <input class="input" v-model="addEmail" type="email" placeholder="Email">
                    </p>
                </div>


                <div class="field">
                    <label class="label">Lösenord</label>
                    <p class="control">
                        <input class="input" v-model="addPassword" type="password" placeholder="Password">
                    </p>
                </div>

                <!-- knappar för att återställa lösenord eller logga in -->
                <div class="field">
                    <p class="control">
                        <button class="button is-success" @click.prevent="submitUser()">
                            Login
                        </button>
                        <button id="reset-password" class="button is-warning" @click.prevent="resetPassword()">
                            Återställ lösenord
                        </button>
                    </p>
                </div>
            </form>

            <!-- modalfooter med meddelande -->
            <div class="modal-card-foot">
                <div class="modal-content">
                    <p id="message" v-if="eventMessage">{{ eventMessage }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

//Importerar axios för hantera fetch-anrop
import axios from 'axios';

//Export klassen
export default {

    //variabler för att läsa in formulärdata. Även variabler för meddelande.
    data() {
        return {
            addEmail: "",
            addPassword: "",
            eventMessage: ""
        };
    },

    //Vid appstart laddas all kod in för att styra denna model
    mounted() {

        // öppna modal
        function openModal($el) {
            $el.classList.add('is-active');
        }
        // Stänga modal
        function closeModal($el) {
            $el.classList.remove('is-active');
        }
        //metod för att stänga om flera
        function closeAllModals() {
            (document.querySelectorAll('.modal') || []).forEach(($modal) => {
                closeModal($modal);
            });
        }

        // Eventlistener för att stänga specfik modal
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
            const modal = $trigger.dataset.target;
            const $target = document.getElementById(modal);

            $trigger.addEventListener('click', () => {
                this.eventMessage = ``;
                openModal($target);
            });
        });

        // Eventlistener för child element till modal
        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            const $target = $close.closest('.modal');

            $close.addEventListener('click', () => {
                this.eventMessage = ``;
                closeModal($target);
            });
        });

        //Modal går att stänga med tangenbordet
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape") {
                this.eventMessage = ``;
                closeAllModals();
            }
        });
    },

    methods: {

        //Återställer formulär/tömmer det
        emptyForm() {
            this.addEmail = "";
            this.addPassword = "";
        },

        //Post-anrop som logga in användare
        loginUser(email, password) {
            //Post request under uppbyggnad
            axios.post('https://nest-js-discgolf-grossisten.onrender.com/auth/login', {

                "email": email,
                "password": password
            })
                .then((response) => {

                    //Formuläret rensas samt skrivs ett meddelande ut till skärmen
                    this.eventMessage = `Du är nu inloggad som ${email}.`;
                    this.emptyForm();

                    //Token sparas i sessionstorage och lagersidan laddas
                    sessionStorage.setItem("access_token", response.data.access_token);
                    window.location.href = "/inventorie";
                })

                //Vid fel skrivs felet ut i konsollen samt skriver ut ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = `Om kontot redan är verifierat kontrollera email och lösenord`;
                })
        },

        //Vid submit 
        submitUser() {

            //Innan uppdatering kontrolleras alla inmatade värden
            let check = this.controlInput(this.addEmail, this.addPassword);

            //utan fel så skickas värdena till en post api fetch-anrop
            if (check) {
                this.loginUser(
                    this.addEmail,
                    this.addPassword
                )
            }
        },

        //Vid submit 
        resetPassword() {
            this.eventMessage = `En länk för att återställa lösenordet är skickat till ${this.addEmail} (Beta-funktion ej i bruk!)`;
        },

        // Metod som kontrollar att inmatningar är korrekta från formuläret.
        controlInput(email, password) {
            let testArr = [];
            let testBool = true;

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (email === "") {
                testArr.push("Fyll i email. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (password === "") {
                testArr.push("Fyll i password. ")
                testBool = false;
            }

            //Vid fel skrivs alla felmeddelanden ut till skärmen och false returneras
            let errorString = "";
            if (!testBool) {
                testArr.forEach(element => {
                    errorString = errorString + element;
                });
                this.eventMessage = errorString;
            }
            //utan fel returneras true
            return testBool
        },
    }
};

</script>

<style scoped>
form {
    text-align: left;
}

#reset-password {
    margin-left: 20px;
}
</style>
