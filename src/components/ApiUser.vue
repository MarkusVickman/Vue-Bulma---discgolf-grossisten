<template>
    <!-- Skriver ut information till skärmen med hjälp av props och emits -->
    <UserTable :userData="userData" :userAccount="userAccount" :eventMessage="eventMessage" @getUser="getUser"
        @getAllUsers="getAllUsers" @getOneUser="getOneUser" @editUser="editUser" @deleteUser="deleteUser"
        @eventMessageWrite="eventMessageWrite" />

</template>

<script>
import UserTable from './UserTable.vue';
import axios from 'axios';

export default {
    name: 'UserData',
    components: {
        UserTable
    },
    //Dataarray för användare samt variabel för meddelande och aktuell användare.
    data() {
        return {
            eventMessage: "",
            userData: [],
            userAccount: [],
        };
    },

    methods: {

        //Metod som skriver data till meddelande variabeln
        eventMessageWrite(message) {
            this.eventMessage = message;
        },

        //Hämtar aktuell användares data och lagrar den till objectvariabeln userAccount
        async getUser(callback) {
            try {
                const token = sessionStorage.getItem('access_token');
                const headers = { 'Authorization': `Bearer ${token}` };
                let response = await axios.get(`https://dg-gross-1050979898493.europe-north1.run.app/auth/profile`, {
                    headers: headers
                })

                //lagrar in datan till ett object i klassen
                this.user = response.data;
                this.userAccount = response.data;

                // Om user.isAdmin är true, hämta användardata 
                if (this.userAccount.isAdmin) {
                    callback(true);
                } else {
                    this.userData.push(this.user);
                    callback(false);
                }

                //Vid fel skrivs felet ut som ett meddelande till skärmen
            } catch (error) {
                this.eventMessage = `Användaren hittades inte`;
            }
        },

        //Hämtar alla inlägg från api med en callback
        async getAllUsers(callback = () => { }) {

            // Om user.isAdmin är true, hämta användardata 
            if (!this.userAccount.isAdmin) {
                return
            }
            this.userData = [];

            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            await axios.get(`https://dg-gross-1050979898493.europe-north1.run.app/user/`, {
                headers: headers
            })
                .then((response) => {
                    this.userData = response.data;
                    let test = response.data;
                    callback(test);
                })
                //Vid fel skrivs felet ut som ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = "Inga användare hittades.";
                })
        },

        //Metod som hämtar en användare och skickar tillbaka den i en callback
        async getOneUser(email, callback) {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            await axios.get(`https://dg-gross-1050979898493.europe-north1.run.app/user/${email}`, {
                headers: headers
            })
                .then((response) => {
                    //lagrar in datan till ett object som returneras med callback
                    let user = response.data;
                    callback(user);
                })

                //Vid fel skrivs ett meddelande ut till skärmen
                .catch((error) => {
                    this.eventMessage = `Användaren hittades inte`;
                    return false;
                })
        },

        //Metod som ändrar användaruppgifter
        async editUser(newEmail, email, name, isVerified, isAdmin, password, callback) {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            await axios.put(`https://dg-gross-1050979898493.europe-north1.run.app/user/${email}`, {
                email: newEmail,
                name: name,
                isVerified: isVerified,
                isAdmin: isAdmin,
                password: password
            }, {
                headers: headers
            })
                .then((response) => {
                    return true;
                })

                //Vid fel skrivs ett meddelande ut till skärmen
                .catch((error) => {
                    this.eventMessage = `Användaren gick inte att uppdatera. Ange giltig email.`;
                    return false;
                })
        },

        //Delete request med id
        deleteUser(email) {
            const token = sessionStorage.getItem('access_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            axios.delete(`https://dg-gross-1050979898493.europe-north1.run.app/user/${email}`, {
                headers: headers
            })
                .then((response) => {
                    this.getAllUsers();
                })
                //Vid fel skrivs ett meddelande till skärmen
                .catch((error) => {
                    this.eventMessage = `Id ${email} gick inte att ta bort.`;
                })
        },
    }
}
</script>