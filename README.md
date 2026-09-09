# Školski raspored — web/PWA verzija (za Android)

Ovo je web inačica desktop aplikacije, napravljena kao **Progressive Web App
(PWA)** - instalira se na Android (i iPhone) izravno iz preglednika, bez
Play Storea, i radi i bez interneta nakon prvog otvaranja.

Logika izračuna tjedna/turnusa je identičan port desktop verzije (`app/models.py`
→ `js/models.js`) - isti scenariji, isto ponašanje, uključujući promjenu
turnusa usred godine.

## Dijeljenje s drugim roditeljima

Budući da je ovo obična web stranica, isti link možeš poslati bilo kojem
roditelju - svatko na svom mobitelu unese svoje dijete/djecu i to ostaje
spremljeno lokalno na njihovom uređaju (svatko ima svoje podatke, nitko ne
vidi tuđe).

## Značajke (identične desktop verziji)

- Veliki status na vrhu: datum, redni broj tjedna, raspon datuma, aktivni
  turnus - uvijek prikazuje stvarno "danas", neovisno o tome koji tjedan
  pregledavaš.
- Više djece - svako sa svojim turnusima, datumom početka i nazivima
  turnusa (npr. "A"/"B" ili "AB"/"CD").
- Prikaz oba tjedna jedan pored drugog (na širem zaslonu) ili jedan ispod
  drugog (na mobitelu) - dodirom na tjedan prikazuje se samostalno.
- Subota i nedjelja vidljive, zasivljene.
- Uređivanje rasporeda kroz izbornik (☰ → Uredi raspored...), bijela polja.
- Promjena/korekcija turnusa usred godine (☰ → Promjena/korekcija turnusa...).
- Ispis / izvoz u PDF preko izbornika (☰ → Ispis...) - otvara nativni
  print dijalog preglednika/mobitela u kojem se odabere "Spremi kao PDF".
- Radi offline nakon prvog otvaranja (service worker keširanje).
- Predsat (vidi dolje) - opcionalni dodatni sat prije redovnog početka
  nastave, za izborne predmete koji nisu svaki dan.
- Font (vidi dolje, gumb "Aa") - font, Bold/Italic/Underline i veličina
  tablice, uživo i trajno, ne samo za ispis. Ovo je zasad samo u web/PWA
  verziji.
- Praznici (vidi dolje, ☰ → Praznici...) - dani koji upadnu u definirani
  praznik obojaju se u tablici, a upozorenje na vrhu javi kad je neki
  praznik u tijeku ili počinje u sljedeća 2 tjedna. Ovo je zasad samo u
  web/PWA verziji.
- Kraj škole (vidi dolje) - opcionalni datum zadnjeg dana nastave, po
  djetetu, s odbrojavanjem u statusnoj traci (npr. "-98 dana"). Ovo je
  zasad samo u web/PWA verziji.

## Vrijeme sati i odmora

U **☰ → Uredi raspored...** postoji odjeljak **"Vrijeme i odmori"** za svaki
turnus posebno (npr. jutarnji turnus može krenuti u 08:00, popodnevni u
13:00 - svaki turnus ima svoje postavke):

- **Početak nastave** - vrijeme prvog sata.
- **Trajanje sata (min)** - zadano 45 min.
- **Mali odmor (min)** - pauza nakon svakog sata, zadano 5 min.
- **Veliki odmor (min)** - zadano 15 min.
- **Veliki odmor nakon sata br.** - koji redni sat je zadnji prije velikog
  odmora (zadano nakon 3. sata).

Na temelju toga se u tablici (i u prikazu i u editoru) uz svaki sat ispisuje
vrijeme početka/kraja, redci malog/velikog odmora umeću se između satova, a
na dnu svake tablice je redak **"Kraj"** koji za svaki dan pokaže kada dijete
te dan stvarno ide doma - računa se prema zadnjem stvarno upisanom satu tog
dana (ako npr. petkom ima samo 4 sata, "Kraj" će to i pokazati, a ne
puni broj sati turnusa).

## Predsat

Za slučaj da neki dan u tjednu postoji dodatni (izborni) sat prije redovnog
početka nastave - npr. redovna nastava kreće u 08:00, ali npr. srijedom
postoji predsat od 07:10 zbog izbornog predmeta - u odjeljku "Vrijeme i
odmori" za svaki turnus postoji kvačica **"Ima predsat"**, sa svojim
poljima:

- **Početak predsata** - vrijeme kad predsat kreće (neovisno o redovnom
  početku nastave), zadano 07:10.
- **Trajanje predsata (min)** - zadano 45 min.

Kad je uključeno, u tablici se iznad 1. redovnog sata pojavljuje dodatan
editabilan redak "Predsat", a ispod njega (ako postoji razmak do redovnog
početka) i redak "Razmak do redovne nastave". Predsat se upisuje po danu -
dane kad ga nema jednostavno se ostave prazni. Redak "Kraj" na dnu tablice
i dalje računa isključivo redovne sate - predsat ne utječe na to kad dijete
stvarno ide doma. I ova postavka je dio sigurnosne kopije (.json) i
kompatibilna je s desktop verzijom aplikacije.

## Font

Gumb **"Aa"** u vrhu (do "+ Novo dijete") otvara postavke fonta koje vrijede
za CIJELU aplikaciju - i za prikaz rasporeda, i za uređivanje (Uredi
raspored), i za ispis:

- **Font** - padajući izbornik (Sustavni, Arial, Verdana, Tahoma, Georgia,
  Times New Roman, Courier New, Comic Sans MS).
- **Bold / Italic / Underline** - neovisne kvačice, mogu se kombinirati.
- **Veličina fonta i tablice** - 10% do 150%. Ovo ne mijenja samo veličinu
  teksta, nego skalira i polja/stupce, pa tako i cijelu tablicu (manji font
  = manja tablica, veći font = veća tablica) - korisno i za one koji žele
  isprintati jako maleno da im stane u pernicu (doslovno - 10% je za to), i
  za one kojima treba veći, deblji font jer slabije vide.

Promjena se odmah vidi na glavnom prikazu i u uređivaču rasporeda, i pamti
se u ovom pregledniku/uređaju (localStorage) - ne treba je svaki put iznova
podešavati. Gumb **"Vrati na zadano"** vraća sve na početne vrijednosti
(sustavni font, 100%, bez Bold/Italic/Underline).

## Praznici

**☰ → Praznici...** otvara popis praznika/neradnih dana - zajednički su za
svu djecu (npr. cijela škola ide na iste zimske praznike):

- Za svaki praznik upišeš **Naziv** (npr. "Zimski praznici", "Proljetni
  praznici", "Državni praznik") i **datum od - do** (oba uključivo; ako je
  praznik samo jedan dan, upiši isti datum u oba polja).
- Popis postojećih praznika prikazan je u istom dijalogu, sa gumbima
  **"Uredi"** (popuni formu postojećim vrijednostima za izmjenu naziva
  ili datuma - gumb tada postane "Spremi izmjene", uz "Odustani od
  izmjene" za prekid bez spremanja) i **"Ukloni"** za brisanje.
- Datume treba upisivati ručno svake godine (praznici se mijenjaju iz
  godine u godinu i ovise o županiji), aplikacija ih ne predlaže sama.
- Datumi (ovdje i u ostatku aplikacije - datum početka škole, promjena
  turnusa) upisuju se u obliku **dd.mm.gggg.** (npr. "23.12.2026.") kroz
  obično tekstualno polje - namjerno ne koristimo ugrađeni kalendarski
  odabir preglednika jer njegov prikaz (redoslijed dan/mjesec/godina, prvi
  dan tjedna) prati jezik/regiju postavljenu u pregledniku ili uređaju, pa
  je znao ispasti američki (mm/dd/gggg, tjedan od nedjelje) neovisno o
  ovoj aplikaciji. Dok upisuješ same znamenke, točke se ubacuju automatski.

Kad neki dan u trenutnom ili idućem tjednu (jedina dva tjedna koja se
prikazuju - vidi gore) upadne u raspon nekog praznika, taj se dan u tablici
oboji (i u zaglavlju stupca ispisan je naziv praznika), na isti način kao
što su vikendi zasivljeni. Boja se prenosi i u ispis/PDF, jer ispis
jednostavno koristi isti prikaz kao zaslon.

Dodatno, ako je neki praznik **danas u tijeku** ili **počinje u sljedeća 2
tjedna**, na vrhu (ispod statusne trake) prikaže se upozorenje s nazivom
praznika, brojem dana do početka i rasponom datuma - da ga ne propustiš.
Ova postavka (kao i praznici sami) je dio sigurnosne kopije (.json).

## Kraj škole (odbrojavanje)

U dijalogu **Novo dijete / Uredi dijete** postoji polje **"Datum kraja
škole (zadnji dan nastave)"** - opcionalno, po djetetu (namjerno nije
zajednička postavka kao praznici, jer npr. osmaši/maturanti znaju
završiti školu ranije od ostale djece):

- Upiše se u istom obliku **dd.mm.gggg.** kao i ostali datumi u
  aplikaciji, ili se ostavi prazno ako ne želiš odbrojavanje.
- Ako je upisan, ispod statusne trake pojavljuje se odbrojavanje, npr.
  **"🎓 Do kraja škole: -98 dana"**, koje se svaki dan automatski
  smanjuje za 1 (računa se od današnjeg datuma uređaja).
- Na sam zadnji dan piše posebna poruka ("🎉 Danas je zadnji dan
  škole!"), a odbrojavanje se sakrije čim taj datum prođe.
- Datum treba svake školske godine ručno ažurirati na novi (aplikacija
  ga ne predlaže sama) - isto kao i praznike.

## Ispis / izvoz u PDF

**☰ → Ispis / Izvoz u PDF...** otvara kratak dijalog prije samog ispisa
(umjesto da odmah otvori dijalog preglednika):

- **Oba turnusa jedan pored drugog** - umjesto da su tjedni jedan ispod
  drugog, prikaže ih jedan pored drugog na istoj stranici (za ovo je
  potrebno u dijalogu ispisa tvog preglednika ručno odabrati i pejzažnu
  orijentaciju - naznačeno je i u samom dijalogu).

Font, veličina i izgled (Bold/Italic/Underline) se posebno ne biraju u ovom
dijalogu - ispis jednostavno koristi trenutnu postavku iz gumba **"Aa"**
("printamo aktualnu veličinu kakva je"), pa što god vidiš na zaslonu to će
otprilike izaći i na papiru/PDF-u.

Ranije je na užem/mobilnom zaslonu ispis znao stati točno na kraju
ponedjeljka i "odrezati" ostatak tjedna (Uto-Ned) - to je bila greška u
CSS-u (tablica je bila vodoravno skrolabilna na zaslonu, a taj se okvir kod
ispisa nije proširio na punu širinu). To je sada ispravljeno neovisno o
gornjim postavkama.

Konačnu veličinu papira i mjerilo (npr. "Prilagodi stranici" / "Fit to
page") i dalje biraš u dijalogu ispisa svog preglednika - aplikacija tu ne
može ništa unaprijed odlučiti umjesto tebe.

## Podsjetnik za sigurnosnu kopiju

Budući da podaci žive samo u pregledniku uređaja (vidi dolje), aplikacija
nakon prvog upisa rasporeda prikaže žuti podsjetnik ispod statusne trake s
gumbom **"Izradi kopiju sada"**. Podsjetnik nestaje čim se napravi izvoz
(ili uvoz) sigurnosne kopije, a ako se odabere "Kasnije", ne pojavljuje se
ponovno idućih 7 dana. Aplikacija dodatno pri pokretanju zatraži od
preglednika "trajno" (persistent) spremište - to preglednik čini manje
sklonim automatskom brisanju podataka pod pritiskom prostora, iako ne
štiti od ručnog "Obriši podatke pregledavanja".

## Gdje se podaci spremaju (i kako napraviti sigurnosnu kopiju)

Aplikacija sprema sve (djecu, turnuse, raspored) u **localStorage** tvog
preglednika - to je prostor koji svaki preglednik drži za svaku web stranicu
posebno. Konkretno to znači:

- Podaci su vezani uz **kombinaciju preglednik + uređaj + adresa (URL)**
  aplikacije. Isti telefon, isti preglednik, ista adresa → podaci ostaju
  trajno, čak i kad zatvoriš aplikaciju ili ugasiš telefon.
- Nije to obična datoteka koju možeš naći kroz Datoteke/Files na telefonu -
  preglednik je drži u svom internom, "sandboxanom" prostoru (to je tako iz
  sigurnosnih razloga, kod svih preglednika, ne samo ove aplikacije) - pa se
  ne može ručno "premjestiti" u neku mapu po želji.
- Podaci se **gube** ako: očistiš povijest/podatke stranica u Chromeu
  ("Clear browsing data" → Cookies and site data), koristiš Incognito/privatni
  način, promijeniš preglednik (npr. iz Chromea u Firefox), ili instaliraš
  aplikaciju na novi telefon.
- Svaki roditelj koji otvori isti link ima **svoje vlastite, odvojene**
  podatke na svom uređaju - nitko ne vidi tuđe.

### Sigurnosna kopija (backup)

Izbornik (☰) sadrži odjeljak **"Sigurnosna kopija"**:

- **⬇ Izvoz podataka (backup)...** - preuzima `.json` datoteku sa svim
  trenutnim podacima (sva djeca, svi rasporedi, sve korekcije turnusa) u tvoju
  Downloads mapu na telefonu/računalu. Odatle je **ti** biraš kamo dalje -
  možeš je premjestiti u Google Drive, poslati si mailom, spremiti na
  računalo... to je sad tvoja obična datoteka, potpuno pod tvojom kontrolom.
- **⬆ Uvoz podataka (vrati iz backupa)...** - odabereš tu `.json` datoteku i
  vrati sve podatke iz nje (uz potvrdu, jer prepisuje trenutne podatke na tom
  uređaju).

Ovo rješava dvije stvari: pravu sigurnosnu kopiju (da ništa ne izgubiš ako se
očisti preglednik) i prebacivanje rasporeda na drugi uređaj (izvezeš na
jednom, uvezeš na drugom).

## Struktura

```
skolski_raspored_web/
├── index.html
├── manifest.webmanifest       # PWA manifest (ime, ikone, boje)
├── sw.js                       # service worker - offline keširanje
├── css/styles.css
├── js/
│   ├── models.js                # podaci + logika tjedan/turnus (JS port)
│   ├── storage.js               # localStorage perzistencija
│   └── ui.js                    # sučelje, modali, interakcije
├── icons/                       # PWA ikone (192/512/512-maskable)
├── js/models.test.mjs           # brzi node testovi za logiku (node js/models.test.mjs)
├── tests_playwright.py          # GUI test kroz pravi preglednik (mobilni viewport)
├── tests_backup.py              # test izvoza/uvoza sigurnosne kopije
├── tests_time.py                # test vremena sati/odmora i podsjetnika za backup
├── tests_print.py               # test postavki ispisa i da print CSS ne reže tablicu
├── tests_font.py                # test postavki fonta (gumb "Aa")
├── tests_holidays.py            # test praznika (dodavanje/uređivanje/uklanjanje, bojanje, banner)
├── tests_dateinput.py           # test ručnog unosa datuma (dd.mm.gggg., auto-formatiranje, validacija)
└── tests_schoolend.py           # test datuma kraja škole po djetetu i odbrojavanja u statusnoj traci
```

## Testovi

```bash
node js/models.test.mjs
```

```bash
pip install playwright && python -m playwright install chromium
python3 -m http.server 8772 &
python3 tests_playwright.py
python3 tests_backup.py
python3 tests_time.py
python3 tests_print.py
python3 tests_font.py
python3 tests_holidays.py
python3 tests_dateinput.py
python3 tests_schoolend.py
```
