<template>
    <!-- Skriver ut information till skärmen med hjälp av props och emits -->
    <DiscTable :discData="discData" :eventMessage="eventMessage" @getAll="getAll" @discGet="discGet" @AddDisc="AddDisc"
        @updateDiscs="updateDiscs" @DiscDelete="DiscDelete" @eventMessageWrite="eventMessageWrite" />
</template>

<script>
import DiscTable from '../components/DiscTable.vue';
import axios from 'axios';

export default {
    name: 'DiscData',
    components: {
        DiscTable
    },
    //Dataarray för discar samt variabel för meddelande.
    data() {
        return {
            discData: [],
            eventMessage: "",
        };
    },

    methods: {

        //Metod som skriver data till meddelande variabeln
        eventMessageWrite(message) {
            this.eventMessage = message;
        },

        //Hämtar alla inlägg från api med en callback
        async getAll(callback) {
            await axios.get('https://nest-js-discgolf-grossisten.onrender.com/disc')
                .then((response) => {
                    this.discData = response.data;
                    callback('');
                })

                //Vid fel skrivs felet ut som ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = "Inga träningsinlägg hittades.";
                })
        },

        //Hämtar ett inlägg med id och skickar tillbaka objecten med callback
        async discGet(id, callback) {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            await axios.get(`https://nest-js-discgolf-grossisten.onrender.com/disc/${id}`, {
                headers: headers
            })
                .then((response) => {
                    //lagrar in datan till ett object i klassen
                    let postObj = response.data;
                    callback(postObj);
                })

                //Vid fel skrivs felet ut som ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = `Inlägg med id ${id} hittades inte`;
                })
        },

        //Lägger till en disc med ett postanrop
        AddDisc(brand, model, version, plastic, amount, description, type, price, flightstats, callback) {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            axios.post(`https://nest-js-discgolf-grossisten.onrender.com/disc/create`, {
                brand: brand,
                model: model,
                version: version,
                plastic: plastic,
                type: type,
                amount: amount,
                fly_stats: flightstats,
                about: description,
                price: price
            }, {
                headers: headers
            })
                .then((response) => {
                    //Vid fel skrivs felet ut som ett meddelande till skärmen
                    this.eventMessage = `Inlägg är sparat.`;
                    callback('');
                })

                //Vid fel skrivs felet ut som ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = `Inlägg gick inte att spara.`;
                })
        },

        //Put till api för att uppdatera inlägg. Tar in alla värden som objekten innehåller.
        updateDiscs(id, amount, brand, model, version, plastic, description, type, price, flightstats) {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            axios.put(`https://nest-js-discgolf-grossisten.onrender.com/disc/update/${id}`, {
                brand: brand,
                model: model,
                version: version,
                plastic: plastic,
                type: type,
                amount: amount,
                fly_stats: flightstats,
                about: description,
                price: price
            }, {
                headers: headers
            })
                .then((response) => {

                    //Vid fel skrivs felet ut som ett meddelande till skärmen samt hamtar den uppdaterade datan (all data)
                    this.eventMessage = `Inlägget är uppdaterat.`;
                    this.getAll(() => {
                    });

                    return true;
                })

                //Vid fel skrivs felet ut som ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = `Inlägg gick inte att uppdatera.`;
                    return false;
                })
        },

        //Delete request med id
        DiscDelete(id) {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            axios.delete(`https://nest-js-discgolf-grossisten.onrender.com/disc/delete/${id}`, {
                headers: headers
            })
                .then((response) => {
                    //Vid fel skrivs felet ut som ett meddelande till skärmen samt hamtar den uppdaterade datan (all data)
                    this.getAll(() => {
                    });
                })

                //Vid fel skrivs felet ut som ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = `Id ${id} gick inte att ta bort`;
                })
        }
    }
}

</script>
