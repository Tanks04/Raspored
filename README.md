# Školski raspored — web/PWA verzija (za Android)

Ovo je web inačica desktop aplikacije, napravljena kao **Progressive Web App
(PWA)** - instalira se na Android (i iPhone) izravno iz preglednika, bez
Play Storea, i radi i bez interneta nakon prvog otvaranja.

Logika izračuna tjedna/turnusa je identičan port desktop verzije (`app/models.py`
→ `js/models.js`) - isti scenariji, isto ponašanje, uključujući promjenu
turnusa usred godine.

## Najbrži put do ikone na mobitelu (GitHub Pages)

1. Napravi besplatan GitHub račun ako ga nemaš (github.com).
2. Napravi novi **public** repozitorij, npr. `skolski-raspored`.
3. U njega ubaci **sav sadržaj ove mape** (`index.html`, `css/`, `js/`,
   `manifest.webmanifest`, `sw.js`, `icons/`) - najlakše kroz "Add file →
   Upload files" na GitHubu, ili preko gita:
   ```bash
   cd skolski_raspored_web
   git init
   git add .
   git commit -m "Školski raspored - web verzija"
   git branch -M main
   git remote add origin https://github.com/<tvoj-username>/skolski-raspored.git
   git push -u origin main
   ```
4. U repozitoriju: **Settings → Pages → Source: Deploy from a branch →
   Branch: main / (root)** → Save.
5. Za par minuta aplikacija je dostupna na
   `https://<tvoj-username>.github.io/skolski-raspored/`.
6. Otvori taj link na Android mobitelu u **Chromeu** → izbornik (tri točkice
   gore desno) → **"Dodaj na početni zaslon"** / "Instaliraj aplikaciju".
   Dobiješ pravu ikonu koja se otvara preko cijelog zaslona, bez adresne
   trake.

GitHub Pages je besplatan i dovoljan za ovu aplikaciju (nema pravog
"backenda" - sve se sprema lokalno na uređaju).

## Alternativa: Netlify Drop (bez gita, najjednostavnije)

1. Otvori [app.netlify.com/drop](https://app.netlify.com/drop) u pregledniku.
2. Povuci cijelu mapu `skolski_raspored_web` (ili zip pa raspakiraj) na
   stranicu.
3. Netlify odmah da link (npr. `nešto-random.netlify.app`) - otvori ga na
   mobitelu i dodaj na početni zaslon kao gore.

## Ako želiš testirati lokalno prije objave

```bash
cd skolski_raspored_web
python3 -m http.server 8000
```

Otvori `http://localhost:8000` u desktop pregledniku. Za testiranje na
samom mobitelu preko lokalne mreže (isti WiFi), pokreni na istom portu i
otvori `http://<IP-adresa-računala>:8000` u mobitelnom pregledniku - napomena:
"Dodaj na početni zaslon" na pravi PWA način (s ikonom i offline radom) traži
HTTPS, pa lokalni IP prikaz radi za testiranje izgleda, ali za pravu
instalaciju treba GitHub Pages/Netlify (koji automatski daju HTTPS).

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

### Sigurnosna kopija (backup) - ovo si tražio

Dodao sam u izbornik (☰) novi odjeljak **"Sigurnosna kopija"**:

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

## Sljedeći korak: uvoz rasporeda iz Excela

Ovo je namjerno ostavljeno za sljedeći krug (rekao si "prvo ovo za
Android") - javi kad želiš da to dodam. Plan: gumb "Uvezi iz Excela" u
dijalogu za uređivanje rasporeda, koji pomoću biblioteke SheetJS pročita
.xlsx datoteku u pregledniku (bez slanja na server) i popuni tablicu.

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
