<template>
    <!-- Template med en tabell för att skriva ut användare -->
    <!-- div som begränsar största storleken på "containern" -->
    <div class="table-container container mt-6">
        <!-- titel för komponenten -->
        <h2 class="title pl-2">Användare</h2>

        <!-- tabell -->
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" v-if="userData">
            <tbody>
                <!-- tabellrad med header för varje kolumn. -->
                <tr>
                    <th class="is-link">Namn</th>
                    <th class="is-link">Email</th>
                    <th class="is-link">Admin</th>
                    <th class="is-link">Åtgärd</th>
                </tr>

                <!-- Tabellrad för att skriva ut den inloggade användaren -->
                <tr>
                    <th scope="row" class="is-info has-text-black">{{ userAccount.name }}</th>
                    <td class="is-info has-text-black">{{ userAccount.email }}</td>
                    <td class="is-info has-text-black">{{ (userAccount.isAdmin === false) ? 'Nej' : 'Ja' }}</td>
                    <td class="has-background-success-light pointer js-modal-trigger " :data-target="userAccount.email"
                        @click="openModal(userAccount.email)"><i class="material-icons has-text-black"
                            title="Uppdatera inlägg">create</i>
                    </td>
                </tr>

                <!-- Loopar igenom arrayen med objekt discData och skriver ut data till tabellen -->
                <template v-for="item in userData.filter(item => item.email)">
                    <tr v-if="userAccount.email !== item.email">
                        <th scope="row" class="has-background-info-light has-text-black">{{ item.name }}</th>
                        <td :class="(item.isVerified === false) ? 'has-background-warning has-text-black' : 'has-background-success has-text-black'">
                            {{
                                item.email }}</td>
                        <td :class="(item.isVerified === false) ? 'has-background-warning has-text-black' : 'has-background-success has-text-black'">
                            {{
                                (item.isAdmin === false) ? 'Nej' : 'Ja' }}</td>
                        <td class="has-background-success-light pointer js-modal-trigger" :data-target="item.email"
                            @click="openModal(item.email)"><i class="material-icons has-text-black" title="Uppdatera inlägg">create</i>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>

    <!-- Modals skapas för varje användare med deras information -->
    <section v-for="item in userData" :key="item.email" class="modal" :id="item.email" :ref="'modal-' + item.email">
        <div class="modal-background"></div>
        <div class="modal-card">

            <!-- Modal header med användarnamn -->
            <div class="modal-card-head">
                <h2 class="modal-card-title"><b>{{ item.name }}</b></h2>
                <button class="delete" aria-label="close"></button>
            </div>

            <!-- Modalbody med formulär -->
            <div class="modal-card-body">
                <form class=" container is-max-desktop">
                    <h2 class="title">Redigera profil</h2>

                    <!-- Inmatningsfällt för namn -->
                    <div class="field">
                        <label class="label">Namn</label>
                        <div class="control ">
                            <input class="input is-primary" v-model="addName" type="text" placeholder="Text input">
                        </div>
                    </div>

                    <!-- Inmatningsfällt för email -->
                    <div class="field">
                        <label class="label">Email</label>
                        <p class="control">
                            <input class="input is-primary" v-model="addEmail" type="email" placeholder="Email">
                        </p>
                    </div>

                    <!-- Inmatningsfällt för lösenord. Visas bara för aktuell användare -->
                    <div class="field" v-if="userAccount.email === item.email">
                        <label class="label">Lösenord</label>
                        <p class="control">
                            <input class="input is-primary" value="" v-model="addPassword" type="password"
                                placeholder="Fyll i för att ändra lösenord">
                        </p>
                    </div>

                    <!-- "submit" för formuläret -->
                    <div class="field">
                        <p class="control">
                            <button class="button is-link" @click.prevent="registerForm(item.email)">
                                Redigera
                            </button>
                        </p>
                    </div>
                </form>
                <br>

                <!-- extraknappar för administratörer för att ändra användaruppgifter -->
                <p v-if="userAccount.email !== item.email"><b>Åtgärder:</b></p>
                <button class="button is-success" @click="VerifyUser(item.email, item.isVerified)"
                    v-if="userAccount.email !== item.email">Verifiera användare</button>
                <button class="button is-danger delete-button" @click="GeneratePassword(item.email)"
                    v-if="userAccount.email !== item.email">Generera
                    lösenord</button>
                <button class="button is-danger" v-if="userAccount.email !== item.email"
                    @click="DeleteUserObject(item.email)">Ta
                    bort användare</button>
                <button class="button is-warning" v-if="userAccount.email !== item.email"
                    @click="ChangeAccType(item.email)">Ändra kontotyp</button>
            </div>

            <!-- modal footer där meddelanden skrivs ut -->
            <div class="modal-card-foot">
                <div class="modal-content">
                    <p id="message" v-if="userAccount.email === item.email">För att se uppdaterad information för eget
                        konto
                        vänligen logga in på nytt.</p>
                    <p id="message" v-if="eventMessage"><b>{{ eventMessage }}</b></p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

//Export klassen med props och emit. UserTable är child till ApiUser.
export default {
    name: "UserTable",
    props: ['userData', 'userAccount', 'eventMessage'],
    emits: ['getUser', 'getAllUsers', 'getOneUser', 'editUser', 'deleteUser', 'eventMessageWrite'],

    //Data med användare samt data för att hämta och skrivat till formuläret.
    data() {
        return {
            addName: "",
            addEmail: "",
            addPassword: "",
            user: [],
        };
    },

    //Vid app start hämtas data och skrivs ut till tabellen samt initierar eventlisteners på dynamisk data.
    mounted() {
        this.getAccount();
    },

    //metoder
    methods: {

        //hämtar data för aktuell användare används för att initierar eventlisteners på dynamisk data.
        async getAccount() {
            await this.getThisAccount();
            this.addEventListener();
        },

        // hämtar data för aktuell användare
        async getThisAccount() {
            return new Promise((resolve, reject) => {
                this.$emit('getUser', (postObj) => {
                    resolve(postObj);
                    //körs enbart när appen laddas och initierar också hämtning av alla användare 
                    if (postObj) {
                        this.getAllEventlistener();
                    }
                });
            })
        },

        // hämtar data för alla användare används för att initierar eventlisteners på dynamisk data.
        async getAllEventlistener() {
            await this.getAllAccounts();
            this.addEventListener();
        },

        // hämtar data för alla användare
        getAllAccounts() {
            return new Promise((resolve, reject) => {
                this.$emit('getAllUsers', (postObj) => {
                    resolve(postObj);
                });
            })
        },

        // hämtar data för en användare
        userGetOne(id) {
            return new Promise((resolve, reject) => {
                this.$emit('getOneUser', id, (postObj) => {
                    resolve(postObj);
                });
            })
        },

        //Metod som skickar data med emit för att redigera användare 
        editOneUser(newEmail, email, name, isVerified, isAdmin, password) {
            return new Promise((resolve, reject) => {
                this.$emit('editUser', newEmail, email, name, isVerified, isAdmin, password, (postObj) => {
                    resolve(postObj);

                });
            })
        },


        //Metod som lägger till eventlisteners på dynamiskdata
        addEventListener() {

            // klickevent för child element
            (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
                const $target = $close.closest('.modal');
                $close.addEventListener('click', () => {
                    //Skickar med target id till closeModal
                    this.closeModal($target.id);
                });
            });
        },

        // Funktion för att öppna
        openModal(id) {
            //Rensar eventmessage
            this.$emit('eventMessageWrite', ``);
            //modal hämtas med ref id som skapats dynamiskt
            const modal = this.$refs['modal-' + id][0];
            modal.classList.add('is-active');
            //Laddar automatisk in information i formuläret
            this.SetForm(id);
            this.addPassword = "";
        },

        //För att stänga modals
        closeModal(id) {
            this.$emit('eventMessageWrite', ``);
            const modal = this.$refs['modal-' + id][0];
            modal.classList.remove('is-active');
            //Laddar om data eftersom att den kan ha uppdaterats
            this.getAccount();
        },

        //Tar bort användare. Användaren måste bekräfta innan förfrågan körs.
        async DeleteUserObject(email) {

            if (confirm("Om du godkänner detta tar du bort användarkontot!")) {
                let response = await this.$emit('deleteUser', email);
                this.closeModal(email);
                this.$emit('eventMessageWrite', `Id ${email} är borttaget.`);
            }
        },

        //Metod som ändra kontotyp från standard till admin
        async ChangeAccType(email) {

            //Läser in användardata
            this.user = await this.userGetOne(email);

            //Om det inte är en admin ändras kontotypen till admin och relevant meddelande skrivs ut.
            if (!this.user.isAdmin) {
                if (this.editOneUser(email, email, this.user.name, this.user.isVerified, true)) {
                    this.$emit('eventMessageWrite', `Användare ${email} är nu admin`);
                } else {
                    this.$emit('eventMessageWrite', `Användare ${email} gick inte att verifiera`);
                }
            } else {//Om det är en admin ändras kontotypen till standard och relevant meddelande skrivs ut.
                if (this.editOneUser(email, email, this.user.name, this.user.isVerified, false)) {
                    this.$emit('eventMessageWrite', `Användare ${email} är nu vanlig användare`);
                } else {
                    this.$emit('eventMessageWrite', `Användare ${email} gick inte att verifiera`);
                }
            }
        },

        //Metod för att verifiera användare
        async VerifyUser(email) {
            //Läser in användardata
            this.user = await this.userGetOne(email);
            //Status ändras till verifierad om användare inte är verifierad och relevant meddelande skrivs ut
            if (!this.user.isVerified) {
                if (this.editOneUser(email, email, this.user.name, true, this.user.isAdmin)) {
                    this.$emit('eventMessageWrite', `Användare ${email} är nu verifierad`);
                } else {
                    this.$emit('eventMessageWrite', `Användare ${email} gick inte att verifiera`);
                }
            } else {
                //Status ändras till ejverifierad om användare är verifierad och relevant meddelande skrivs ut
                if (this.editOneUser(email, email, this.user.name, false, this.user.isAdmin)) {
                    this.$emit('eventMessageWrite', `Användare ${email} är nu avverifierad`);
                } else {
                    this.$emit('eventMessageWrite', `Användare ${email} gick inte att avverifiera`);
                }
            }
        },

        //Metod för att spara ett slumpmässigt lösenord och spara det i databasen
        async GeneratePassword(email) {
            const password = await this.RandomPassword();

            //Testar om användare finns och lagrar userdata
            if (this.user = await this.userGetOne(email)) {
                let name = this.user.name;
                let isVerified = this.user.isVerified;
                let isAdmin = this.user.isAdmin;

                //Om nytt lösenord gick att spara skrivs relevant meddelande ut
                if (this.editOneUser(email, email, name, isVerified, isAdmin, password)) {
                    this.$emit('eventMessageWrite', `Det tillfälliga lösenordet för konto ${email} är ${password}`);
                } else {
                    this.$emit('eventMessageWrite', `Det gick inte att skapa ett tillfälliga lösenord.`);
                }
            }
        },

        //Metod för att skapa slumpmässig sträng för att använda till lösenord
        RandomPassword() {
            let password = "";
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 10; i++) {
                password += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return password;
        },

        //Metod för att automatisk fylla i formulärdata
        async SetForm(email) {
            //Hämtar ett object med data från fetch api
            this.user = await this.userGetOne(email);
            this.addName = this.user.name;
            this.addEmail = this.user.email;
        },

        //Metod för att skicka iväg data för att uppdatera användare
        async registerForm(email) {

            this.$emit('eventMessageWrite', "");
            //Innan uppdatering kontrolleras alla inmatade värden
            let check = this.controlInput();

            //utan fel så skickas värdena till en post api fetch-anrop
            if (check) {
                //Hämtar ett object med data från fetch api
                this.user = await this.userGetOne(email);

                //Beroende på om lösenordet lagras eller ej skrivs relevant meddelande ut och rätt data skickas.
                if (this.addPassword === "") {
                    if (this.editOneUser(this.addEmail, this.user.email, this.addName, this.user.isVerified, this.user.isAdmin)) {
                        this.$emit('eventMessageWrite', `Användaruppgifter är uppdarerade`);
                    }
                } else {
                    if (this.editOneUser(this.addEmail, this.user.email, this.addName, this.user.isVerified, this.user.isAdmin, this.addPassword)) {
                        this.$emit('eventMessageWrite', `Användaruppgifter samt lösenord är uppdarerade`);
                    }
                }
            }
        },

        // Metod som kontrollar att inmatningar är korrekta från formuläret. Används både vill nya inlägg och vid uppdatering
        controlInput() {
            let testArr = [];
            let testBool = true;

            testArr.push("Fyll i: ")

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testbool blir false
            if (this.addName === "" || this.addName <= 4) {
                testArr.push("Namn minst 4 tecken. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testbool blir false
            if (this.addEmail === "" || this.addEmail <= 6) {
                testArr.push("Unik Email minst 6 tecken. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testbool blir false
            if (!this.addPassword === "" && this.addPassword <= 6) {
                testArr.push("Vid byta av lösenord ange minst 6 tecken. ")
                testBool = false;
            }

            //Vid fel skrivs alla felmeddelanden ut till skärmen och false returneras
            let errorString = "";
            if (!testBool) {
                testArr.forEach(element => {
                    errorString = errorString + element;
                });
                this.$emit('eventMessageWrite', errorString);
            }

            //utan fel returneras true
            return testBool
        },
    }
};

</script>
<style scoped>
/* enkel formulärstyling */
form {
    text-align: left;
}

/* klass för när pointer behöver visas */
.pointer {
    cursor: pointer;
}

/* lite marginal till button */
button {
    margin: 0 10px 10px 0;
}
</style>