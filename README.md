# Vue - Discgolf-grossisten
[Discgolf-grossisten](https://dg-gross.netlify.app/) är en single page webbapp skapad med Vue.Js som använder Bulma css för styling. Webbappen används för lagerhantering av discgolf discar. Den har även en hantering av användare för appen. 

Den här webbplatsen är projektuppgiften i kursen DT192G - Fullstacks-utveckling med ramverk. Webbplatsen innehåller bland annat:
* Webbplatsen består av 3 sidor.
* Vue.Js routing
* Komponentspecifik CSS
* Innehåller props, emits mellan apianrop och html-tabeller.
* Reaktiv-data, two-way-binding med V-model
* Responsiv design
* V-for och V-if för att skriva ut data
* Refs för att identifiera.

# Webbappen använder en Api för att lagra data
Repo för att återskapa nest.js api finns på följande länk : [Repo Nest.js backend](https://github.com/Webbutvecklings-programmet/projekt---webbtjanst-api-MarkusVickman).

## Dischantering
Funktionen i applikationen för att hantera ett lager av discgolf-discar har följande funktioner:
* Lägga till discar
* Uppdatera information om disc
* Ta bort discar
* Plocka discar av flera olika modeller samtidigt från lagret.

### Dischantering Databastabell
Discar lagras i en mySql-databas enligt tabellen nedan. 

|                         | disc                                     |              |
|-------------------------|------------------------------------------|--------------|
|id                       |int autoincrement                         | PK           |
|brand                    |varchar(100)                              |              |
|model                    |varchar(100)                              |              |
|version                  |varchar(100)                              |              |
|plastic                  |varchar(100)                              |              |
|amount                   |int                                       |              |
|fly_stats                |varchar(20)                               |              |
|about                    |varchar(10000)                            |              |
|price                    |int                                       |              |


### Dischantering ändpunkter
När id krävs skickas det med som en html-parameter.
Skyddade routes kräver att access_token skickas med som `Authorization`: `Bearer + access_token`.

|Metod  |Ändpunkt           |Beskrivning                                                                 |
|-------|-------------------|----------------------------------------------------------------------------|
|GET    |/disc/             |Hämtar alla lagrade discar.                                                 |
|GET    |/disc/:ID          |Hämtar en specifik disc med angivet ID.                                                         |
|POST   |/disc/create/      |Lagrar en ny disc. Alla parametrar för tabellen behöver skickas med         |
|PUT    |/disc/update/:ID   |Uppdaterar en disc med angivet ID. Skicka med de parametrar du vill ändra.  |
|DELETE |/disc/delete/:ID   |Raderar en disc med angivet ID.                                             |


## Användarhantering
Funktionen i applikationen för att hantera användare har följande funktioner:
* Skapa användare.
* Logga in användare.
* Redigera användare.
* Admin kan autogenerera temporära lösenord åt andra konton.
* Verifiera nya konton för att ge dem tillgång att logga in.
* Avverifiera konton för att ta bort deras tillgång.
* Ändra konton till admin och till vanliga konton.
* Ta bort konton.

### Användarhantering Databastabell
Användare lagras i en mySql-databas enligt tabellen nedan. 

|                         | user                                     |              |
|-------------------------|------------------------------------------|--------------|
|email                    |varchar(200)                              | PK           |
|name                     |varchar(200)                              |              |
|password                 |varchar                                   |              |
|isVerified               |boolean default: false                    |              |
|isAdmin                  |boolean default: false                    |              |

### Användarhantering ändpunkter 
När id krävs skickas det med som en html-parameter.
Skyddade routes kräver att access_token skickas med som `Authorization`: `Bearer + access_token`.

|Metod  |Ändpunkt        |Beskrivning                                                                               |
|-------|----------------|------------------------------------------------------------------------------------------|
|GET    |/user/          |Hämtar alla användare.                                                                    |
|GET    |/user/:email    |Hämtar en specifik användare med angivet ID.                                              |
|POST   |/user/register/ |Skapar en ny användare om emailen inte finns redan. Name, email och lösenord skickas med. |
|PUT    |/user/:email    |Uppdaterar en användare med angivet ID. Skicka med de parametrar du vill ändra.           |
|DELETE |/user/:email    |Raderar en användare med angivet ID.                                                      |
|GET    |/auth/profile/  |Hämtar aktuell inloggad användare.                                                        |
|POST   |/auth/login/    |Loggar in och returnerar access_token                                                     |



## Installera projektet
```sh
npm install
```

### Kompilera och Hot-Reload under utvecklingsstadiet

```sh
npm run dev
```

### Kompilera och minifiera för produktion

```sh
npm run build
```
Färdiga produktionsfilerna sparas i dist-katalogen.

#### Markus Vickman, MAVI2302
