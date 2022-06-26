1. Klonirati git repo
2. Promjeniti ROOT URL backenda unutar /constants/URL.js
3. expo start
4. Skenirati QR kod unutar expo go aplikacije na mobilnom telefonu, potrebno ju je preuzeti na google play ili apple storeu
5. unutar constants/URL.js modificirati URL

Za testiranje na samom uredjaju, npr. androidov apk file na simulatoru ili lokalno pratiti upute s:
https://docs.expo.dev/classic/building-standalone-apps/




*NOTE*
- za light/dark mode viditi unutar Main.js kod NavigationContainer propsa (iako sam passao dark mode prop i dalje mi je bio light mode, moguce da je do mog uredjaja)

- kod Chart komponente s obzirom da se koriste dvije Line subkomponente paziti na prop xDomain max atribut

- kod Horizontal Axis komponente paziti na includeOriginTick prop te ukoliko se on koristi/ne koristi paziti onda i na broj u propu tickCountu

- historyData i predictedData dijele zajednickog clana (zadnji clan od historyData je i prvi clan od predictedData) tako da bi se mogla iscrtati pravilno linija izmedju dva Line objekta

- paziti na renderanje Line i Area te from propom, ukoliko se rendera, a array je undefined/null/prazan zna biti Array.from error, rjesava se s provjerom uvjeta lengtha arraya

- unutar GDD screena s obzirom da je broj tickova fiksan, kad ima malo vrijednosti pa nakon sto se skaliraju tickovi s tockama grafa, boja od predicted i history Area ne odgovora ticku koji bude zapravo taj granicni clan, mozda je bolje dodat onaj tooltip scroolanje i ukljucit dinamican broj tickova. U istoimenom screenu sam nekad dobio error "[[2,7],[2,2],[[1]],2848] Malformed calls from JS: field sizes are different.", nisam ga uspio debugirat i otkud je dolazio te ga nisam uspio replicirati.

- unutar Yield screena godina na grafu zapravo oznacavana kraj te godine (cjelokupni yield prinos u toj godini). Također, kod provjere godina uzima se fullYear of min i max s perioda od API-ija, pretpostavka je da svaka godina u bazi podataka počinje 1.1.XXXX i završava 31.12.XXXX jer simulacija treba sve dane u godinu. Paziti isto kod viewport propa atribut width u objektu, nekad zna kad je premalo vrijednosti na grafu da se scrolla ostavit prazninu na pocetku i shiftat cijeli graf udesno.

- s obzirom na to da se koriste dva Line, ToolTip prop koji omogućava klikanje na graf i dobivanje vrijednosti točke se pojavljuje dvaput što izgleda zbugano, ali zapravo nije, možda je bolje onda rješenje koristit jedan Line, a dva Area pa da je razlika history i predicted samo ispod površine grafa, a ne i same linije (puna i iscrtkana)
- u custom hookama metadata je neiskoristen, ali sam ga u startu odmah bio napravio ukoliko bi mi zatrebao pa cu ga ostavit ipak ukoliko se API mijenja

- react-responsive-linechart nekad zna ne renderat plavu tocku (plavi kvadratic moj stil tocke) na pocetku grafa, i dalje se moze kliknuti vrijednost ako se koristi tooltip, includeOriginTick su mi na true na obje osi, bug knjižnice pretpostavljam 

