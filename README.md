# Školski raspored — web/PWA verzija (za Android)

Ovo je web inačica desktop aplikacije, napravljena kao **Progressive Web App
(PWA)** - instalira se na Android (i iPhone) izravno iz preglednika, bez
Play Storea, i radi i bez interneta nakon prvog otvaranja.

Logika izračuna tjedna/turnusa je identičan port desktop verzije (`app/models.py`
→ `js/models.js`) - isti scenariji, isto ponašanje, uključujući promjenu
turnusa usred godine.


## Dijeljenje s drugim roditeljima

Budući da je ovo obična web stranica, isti link (npr. GitHub Pages URL)
možeš poslati bilo kojem roditelju - svatko na svom mobitelu unese svoje
dijete/djecu i to ostaje spremljeno lokalno na njihovom uređaju (svatko ima
svoje podatke, nitko ne vidi tuđe). 

## Značajke

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

**"Sigurnosna kopija"**:

- **⬇ Izvoz podataka (backup)...** - preuzima `.json` datoteku sa svim
  trenutnim podacima (sva djeca, svi rasporedi, sve korekcije turnusa) u tvoju
  Downloads mapu na telefonu/računalu. Odatle biraš kamo dalje -
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
└── tests_backup.py              # test izvoza/uvoza sigurnosne kopije
```

## Testovi

```bash
node js/models.test.mjs
```

```bash
pip install playwright && python -m playwright install chromium
python3 -m http.server 8765 &
python3 tests_playwright.py
```
