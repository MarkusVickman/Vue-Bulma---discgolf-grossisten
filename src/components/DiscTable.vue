<template>
    <!-- div som begränsar största storleken på "containern" -->
    <div class="table-container container mt-6">
        <!-- titel för komponenten -->
        <p class="title pl-2">Discar i lager</p>

        <!-- tabell -->
        <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <tbody>
                <!-- tabellrad med header för varje kolumn. Styling görs för att indikera oklara rader -->
                <tr>
                    <th class="is-link">Märke - Modell</th>
                    <th class="is-link">Version - Plast</th>
                    <th class="is-link">I lager</th>
                    <th class="is-link">Läs mer</th>
                    <th class="is-link">Snabb plocka</th>
                </tr>

                <!-- Loopar igenom arrayen med objekt discData och skriver ut data till tabellen -->
                <tr v-for="item in discData">
                    <th scope="row" class="has-background-info-light">{{ item.brand + " - " + item.model }}</th>
                    <!--<td>{{ item.type }}</td>-->
                    <td class="has-background-info-light">{{ item.version + " - " + item.plastic }}</td>
                    <td class="has-background-info-light">{{ item.amount }}</td>
                    <td class="has-background-success-light pointer js-modal-trigger" :data-target="item.id"
                        @click="openModal(item.id)">Läs
                        mer</td>
                    <td>
                        <input class="input reserve is-primary" type="number" min="0" :max="item.amount"
                            placeholder="Antal" :id="item.id">
                    </td>
                </tr>
            </tbody>
        </table>
        <button class="button is-pulled-right is-link" @click="reserveDiscs()">Plocka</button>
    </div>

    <!-- discData loopas igenom igen och en modal med referens skapas för varje object -->
    <section v-for="item in discData" :key="item.id" class="modal" :ref="'modal-' + item.id">
        <div class="modal-background"></div>
        <div class="modal-card">
            <div class="modal-card-head">
                <h2 class="modal-card-title"><b>{{ item.brand + ' - ' + item.model }}</b></h2>
                <button class="delete" aria-label="close"></button>
            </div>
            <div class="modal-card-body">

                <!-- En modal skapas med tital av märke och modell samt alla data sammanställd i en lista -->
                <ul>
                    <li><b>Märke: </b>{{ item.brand }}</li>
                    <li><b>Modell: </b>{{ item.model }}</li>
                    <li><b>Version: </b>{{ item.version }}</li>
                    <li><b>Flygegenskaper: </b>{{ item.fly_stats }}</li>
                    <li><b>Disctyp: </b>{{ item.type }}</li>
                    <li><b>Plast: </b>{{ item.plastic }}</li>
                    <li><b>Pris: </b>{{ item.price }}kr</li>
                    <li><b>Lagersaldo: </b>{{ item.amount }}st</li>
                </ul>

                <p><b><u>Beskrivning</u></b></p>
                <p> {{ item.about }} </p>

                <br>
                <!-- Knappar för att fylla i formulär eller tabort discdatarad -->
                <button class="button is-light is-link" @click="FillUpdateForm(item.id)">Uppdatera</button>
                <button class="button is-light is-danger delete-button" @click="DeleteDiscObject(item.id)">Ta
                    bort</button>
            </div>
            <div class="modal-card-foot">
                <div class="modal-content">
                    <p id="message" v-if="eventMessage"><b>{{ eventMessage }}</b></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Formulär för att skapa och uppdatera inlägg. Titeln ändras beroende på om det ska läggas till eller uppdateras -->
    <form class="container mt-6 p-5">
        <p class="title">{{ formTitle }}</p>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addBrand">Märke</label>
            <div class="control">
                <input class="input is-primary" type="text" placeholder="DiscCraft" id="addBrand" name="addBrand"
                    v-model="addBrand">
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addModel">Modell</label>
            <div class="control">
                <input class="input is-primary" type="text" placeholder="Buzz" id="addModel" name="addModel"
                    v-model="addModel">
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addVersion">Version</label>
            <div class="control">
                <input class="input is-primary" type="text" placeholder="Ex. Standard" id="addVersion" name="addVersion"
                    v-model="addVersion">
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addPlastic">Plast</label>
            <div class="control">
                <input class="input is-primary" type="text" placeholder="Big Z" id="addPlastic" name="addPlastic"
                    v-model="addPlastic">
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addAmount">Lagersaldo</label>
            <div class="control">
                <input class="input is-primary" type="number" min="1" max="2000" placeholder="213" id="addAmount"
                    name="addAmount" v-model="addAmount">
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addDescription">Beskrivning</label>
            <div class="control">
                <textarea class="textarea is-primary" placeholder="Beskrivande text" id="addDescription"
                    name="addDescription" v-model="addDescription"></textarea>
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label">Disctyp</label>
            <div class="control">
                <div class="select is-primary">
                    <select v-model="addDiscType">
                        <option value="Putter">Putter</option>
                        <option value="Midrange">Midrange</option>
                        <option value="Fairway">Fairway</option>
                        <option value="Driver">Driver</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addPrice">Pris</label>
            <div class="control">
                <input class="input is-primary" type="number" min="10" max="500" placeholder="159" id="addPrice"
                    name="addPrice" v-model="addPrice">
            </div>
        </div>

        <!-- Input som använder v-model -->
        <div class="field">
            <label class="label" for="addFlightStats">Flygegenskaper</label>
            <div class="control">
                <input class="input is-primary" type="text" placeholder="10-5-1-2" id="addFlightStats"
                    name="addFlightStats" v-model="addFlightStats">
            </div>
        </div>

        <!-- Tre knappar, en för lägg till, en för updatera och en för att avbryta uppdatering. -->
        <div class="field is-grouped">
            <div class="control">
                <button class="button is-link" @click.prevent="submitForm()" id="submitButton">Submit</button>
                <button class="button is-link" @click.prevent="UpdateForm()" id="updateButton"
                    style="display:none;">Uppdatera ID: {{ addId }}</button>
                <button class="button is-link" @click.prevent="stopUpdate()" id="stopUpdateButton"
                    style="display:none;">Avbryt</button>
            </div>
        </div>

        <!-- Används för att skriva ut alla meddelanden som gäller felande eller lyckade uppdateringar och ändringar till tabellen. -->
        <p><b>{{ eventMessage }}</b></p>
    </form>
</template>

<style scoped>
table {
    overflow: scroll;
}

.pointer {
    cursor: pointer;
}

/* Styling av knappen för att avbryta uppdatering i tabellen. */
#stopUpdateButton,
.delete-button {
    margin-left: 10px;
}

/* Styling i tabellkolumner för att text ska synas i darkmode */
.has-background-success-light,
.has-background-info-light {
    color: black;
}
</style>

<script>

//Export klassen med props och emit. DiscTable är child till ApiDiscs.
export default {
    name: "DiscTable",
    props: ['discData', 'eventMessage'],
    emits: ['getAll', 'discGet', 'AddDisc', 'updateDiscs', 'DiscDelete', 'eventMessageWrite'],

    //Data för att läsa av och fylla i inmatningsfälls. reservedDiscsArr för att "plocka" från lagret och postObj för enskilt obj. 
    // Även variabel att ändra titel på formuläret.
    data() {
        return {
            reservedDiscsArr: [],
            postObj: {},
            formTitle: "Skapa Lagerrad",
            addBrand: "",
            addModel: "",
            addVersion: "",
            addPlastic: "",
            addAmount: "",
            addDescription: "",
            addDiscType: "",
            addPrice: "",
            addFlightStats: "",
            addId: "",
        };
    },

    //Vid app start hämtas data och skrivs ut till tabellen samt initierar eventlisteners på dynamisk data.
    mounted() {
        this.getAllEventlistener();
    },

    //metoder
    methods: {

        // hämtar data för alla adiscar. Används för att initierar eventlisteners på dynamisk data.
        async getAllEventlistener() {
            await this.getAllDiscs();
            this.addEventListener();
        },

        //Metod som initierar apiAnrop för att hämta alla discar
        getAllDiscs() {
            return new Promise((resolve, reject) => {
                this.$emit('getAll', (postObj) => {
                    resolve(postObj);
                });
            })
        },

        //Metod som initierar apiAnrop för att hämta en disc
        discGetOne(id) {
            return new Promise((resolve, reject) => {
                this.$emit('discGet', id, (postObj) => {
                    resolve(postObj);
                });
            })
        },

        //Metod som initierar apiAnrop för att lägga till en ny disc
        discAdd() {
            return new Promise((resolve, reject) => {
                this.$emit('AddDisc', this.addBrand, this.addModel, this.addVersion, this.addPlastic, parseInt(this.addAmount), this.addDescription, this.addDiscType, parseInt(this.addPrice), this.addFlightStats, (postObj) => {
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
                    this.closeModal($target);
                });
            });

            // klickevent för att stänga modals med tangentbordet
            document.addEventListener('keydown', (event) => {
                if (event.key === "Escape") {
                    this.closeAllModals();
                }
            });
        },

        // Funktion för att öppna
        openModal(id) {
            this.$emit('eventMessageWrite', "");
                  //modal hämtas med ref id som skapats dynamiskt
            const modal = this.$refs['modal-' + id][0];
            modal.classList.add('is-active');
        },

        //För att stänga modals
        closeModal($el) {
            this.$emit('eventMessageWrite', "");
            $el.classList.remove('is-active');
        },

        //För att stänga alla modals
        closeAllModals() {
            (document.querySelectorAll('.modal') || []).forEach(($modal) => {
                this.$emit('eventMessageWrite', "");
                this.closeModal($modal);
            });
        },

        //Metod som använder en array av alla valda discar att ändra lagerstatus på.
        async reserveDiscs() {
            let reserveArr = document.querySelectorAll(".reserve");

            //Loopar igenom listan av discar och skickar apianrop för varje. Räknar ut vad det nya lagersaldot ska vara
            for (let i = 0; i < reserveArr.length; i++) {
                let amount = Number(reserveArr[i].value);
                if (amount !== 0) {
                    amount = reserveArr[i].max - amount;
                    let id = reserveArr[i].id;
                    await this.$emit('updateDiscs', id, amount);
                }
            };
            reserveArr.forEach(element => {
                element.value = "";
            });
        },

        //Vid submit 
        async submitForm() {

            //Innan uppdatering kontrolleras alla inmatade värden
            let check = this.controlInput(this.addBrand, this.addModel, this.addVersion, this.addPlastic, this.addAmount, this.addDescription, this.addDiscType, this.addPrice, this.addFlightStats);

            //utan fel så skickas värdena till en post api fetch-anrop. Sen rensar formulär och eventlisteners samt data laddas om
            if (check) {
                await this.discAdd();
                this.emptyForm();
                this.getAllEventlistener();
            }
        },

        //Återställer formulär/tömmer det
        emptyForm() {
            this.addBrand = "", this.addModel = "", this.addVersion = "", this.addPlastic = "", this.addAmount = "", this.addDescription = "", this.addDiscType = "", this.addPrice = "", this.addFlightStats = "";

            //Återställer visningsläge för knappar till formuläret
            document.getElementById("updateButton").style.display = "none";
            document.getElementById("stopUpdateButton").style.display = "none";
            document.getElementById("submitButton").style.display = "inline";

            //Ändrar rubrik i formuläret
            this.formTitle = "Skapa Lagerrad";
        },

        //Vid avbryten uppdatering i formuläret återställs knapparnas visningsläge och formuläret töms
        stopUpdate() {
            this.emptyForm();
            document.getElementById("updateButton").style.display = "none";
            document.getElementById("stopUpdateButton").style.display = "none";
            document.getElementById("submitButton").style.display = "inline";
        },

        //Metod för att fylla i formuläret automatiskt när en disc ska uppdateras
        async FillUpdateForm(id) {

            //ändrar visningsläge för knappar i tabellen
            document.getElementById("updateButton").style.display = "inline";
            document.getElementById("stopUpdateButton").style.display = "inline";
            document.getElementById("submitButton").style.display = "none";

            //Ändrar rubrik i formuläret
            this.formTitle = "Uppdatera Lagerrad";

            //Hämtar ett object med data från fetch api
            this.postObj = await this.discGetOne(id);

            //Hämtar värderna och skriver ut dessa värden till formuläret
            this.addBrand = this.postObj.brand;
            this.addModel = this.postObj.model;
            this.addVersion = this.postObj.version;
            this.addPlastic = this.postObj.plastic;
            this.addAmount = this.postObj.amount;
            this.addDescription = this.postObj.about;
            this.addDiscType = this.postObj.type;
            this.addPrice = this.postObj.price;
            this.addFlightStats = this.postObj.fly_stats;
            this.addId = this.postObj.id;

            //Stänger modals
            this.closeAllModals();
        },

        //Metod för att uppdatera discdata till api 
        async UpdateForm() {

            //ändrar visningsläge för knappar i tabellen
            document.getElementById("updateButton").style.display = "inline";
            document.getElementById("stopUpdateButton").style.display = "inline";
            document.getElementById("submitButton").style.display = "none";

            //Innan uppdatering kontrolleras alla inmatade värden
            let check = this.controlInput(this.addBrand, this.addModel, this.addVersion, this.addPlastic, this.addAmount, this.addDescription, this.addDiscType, this.addPrice, this.addFlightStats);

            //utan fel så skickas värdena till en post api fetch-anrop
            if (check) {
                await this.$emit('updateDiscs', this.addId, parseInt(this.addAmount), this.addBrand, this.addModel, this.addVersion, this.addPlastic, this.addDescription, this.addDiscType, parseInt(this.addPrice), this.addFlightStats);
                this.emptyForm();
            }

        },

        // Metod som kontrollar att inmatningar är korrekta från formuläret. Används både vill nya inlägg och vid uppdatering
        controlInput(brand, model, version, plastic, amount, description, type, price, flightstats) {
            let testArr = [];
            let testBool = true;

            testArr.push("Felvärde på: ");

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (brand === "" || brand.length > 100) {
                testArr.push("Märke. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (model === "" || model.length > 100) {
                testArr.push("Modell. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (version === "" || version.length > 100) {
                testArr.push("Version. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (plastic === "" || plastic.length > 100) {
                testArr.push("Plast. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (parseInt(amount) === NaN || parseInt(amount) > 10000) {
                testArr.push("Lagersaldo. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (description === "" || description.length > 10000) {
                testArr.push("Beskrivning. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (type === "") {
                testArr.push("Disctyp. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (price == "" || price == 0 || parseInt(price) === NaN || parseInt(price) > 10000) {
                testArr.push("Pris. ")
                testBool = false;
            }

            //Vid icke uppfyllda krav läggs ett felmeddelande till i arrayen med felmeddelanden och testBool blir false
            if (flightstats === "" || flightstats.length > 20) {
                testArr.push("Flygegenskaper. ")
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

        //Metod som säkerställer att användaren vill ta bort en disc sedan skickas ett api-anrop
        DeleteDiscObject(id) {

            if (confirm("Om du godkänner detta tar du bort hela lagerraden!")) {
                this.$emit('DiscDelete', id);
                this.closeAllModals();
                this.$emit('eventMessageWrite', `Id ${id} är borttaget.`);
            }
        },
    },
}

</script>
