<template>
    <!-- Modal för registrering av användare med formulär och apianrop -->
    <button class="js-modal-trigger button is-light" data-target="modal-js-register">
        Skapa användare
    </button>

    <section id="modal-js-register" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <div class="modal-card-head">
                <h2 class="modal-card-title">Skapa användare</h2>
                <button class="delete" aria-label="close"></button>
            </div>
            <form class="modal-card-body">

                <div class="field">
                    <label class="label">Namn</label>
                    <div class="control ">
                        <input class="input" v-model="addName" type="text" placeholder="Text input">
                    </div>
                </div>

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
                <div class="field">
                    <p class="control">
                        <button class="button is-success" @click.prevent="registerForm()">
                            Registrera
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
            addName: "",
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

        //Metod som skickar inväg registrering
        registerForm() {
            this.eventMessage = "";
            //Innan registrering kontrolleras alla inmatade värden
            let check = this.controlInput();

            //utan fel så skickas värdena till en post api fetch-anrop
            if (check) {
                this.registerUser(this.addName, this.addEmail, this.addPassword);
            }
        },

        //Återställer formulär/tömmer det
        emptyForm() {
            this.addName = "";
            this.addEmail = "";
            this.addPassword = "";
        },

        //Post-anrop som registrerar ny användare
        async registerUser(name, email, password) {
            //Post request under uppbyggnad
            await axios.post('https://dg-gross-1050979898493.europe-north1.run.app/user/register', {
                "name": name,
                "email": email,
                "password": password
            })
                .then((response) => {
                    if (response.data === true) {
                        //Formuläret rensas samt skrivs ett meddelande ut till skärmen
                        this.eventMessage = `Du är nu registrerad som ${email}. Innan du kan logga in måste din närmaste chef godkänna profilen.`;
                        this.emptyForm();
                    } else {
                        this.eventMessage = 'Eposten är redan registrerad';
                    }
                })
                //Vid fel skrivs felet ut i konsollen samt skriver ut ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = `${error}. Användare gick inte att skapa. Kontrollera testa en annan email och kontrollera namn samt lösenord`;
                })
        },

        // Metod som kontrollar att inmatningar är korrekta från formuläret.
        controlInput() {
            let testArr = [];
            let testBool = true;

            testArr.push("Fyll i: ")

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBoolk blir false
            if (this.addName === "") {
                testArr.push("Namn. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBoolk blir false
            if (this.addEmail === "") {
                testArr.push("Unik Email. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBoolk blir false
            if (this.addPassword === "" || this.addPassword.length <= 5) {
                testArr.push("Lösenord på minst 6 tecken. ")
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
</style>