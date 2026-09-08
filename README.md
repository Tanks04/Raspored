# Školski raspored — web/PWA verzija (za Android)

Ovo je web inačica desktop aplikacije, napravljena kao **Progressive Web App
(PWA)** - instalira se na Android (i iPhone) izravno iz preglednika, bez
Play Storea, i radi i bez interneta nakon prvog otvaranja.

## Dijeljenje s drugim roditeljima

Budući da je ovo obična web stranica, isti link (npr. GitHub Pages URL)
možeš poslati bilo kojem roditelju - svatko na svom mobitelu unese svoje
dijete/djecu i to ostaje spremljeno lokalno na njihovom uređaju (svatko ima
svoje podatke, nitko ne vidi tuđe). Ovo je ujedno i dobra baza za onu drugu
ideju (Streamlit aplikacija za sve roditelje) ako kasnije poželiš dodati
zajedničku bazu/sinkronizaciju.

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
  aplikacije. Isti telefon, isti Chrome, ista adresa (npr. tvoj GitHub Pages
  link) → podaci ostaju trajno, čak i kad zatvoriš aplikaciju ili ugasiš
  telefon.
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

Izbornik (☰) novi odjeljak **"Sigurnosna kopija"**:

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

Ako kasnije poželiš da se podaci **automatski** sinkroniziraju između više
uređaja/roditelja (bez ručnog izvoza/uvoza), to bi tražilo pravi backend
(bazu podataka na internetu) - javi pa to ugradimo, moguće čak u sklopu one
Streamlit ideje za sve roditelje.

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
└── tests_print.py               # test postavki ispisa i da print CSS ne reže tablicu
