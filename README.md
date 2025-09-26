# TechStyle SeamPilot — Технічне завдання (README)

> **Мета:** створити веб‑застосунок для **цифрових робочих інструкцій** під час відшиву зразка: фіксація кроків (фото/відео/аудіо/текст), коментарі, охайний PDF і мінімальний MVP.  
> **Хакатон:** TechStyle Hackathon — Ideathon (вересень 2025).

---

## 1. Проблема та рішення

### 1.1. Проблема
- перший зразок відшивають за **паперовою інструкцією** (техпакет), яка часто неповна та неоновлювана;
- «племінні знання»: після затвердження решта звертаються до **першої швачки**, а не до документа;
- комунікація ітеративна й хаотична (фото/відео летять у месенджерах, губляться в історії).

### 1.2. Рішення
- один простий веб‑інструмент, де **кроки відшиву** фіксуються під час роботи: фото/відео/аудіо + короткі нотатки у вигляді тексту.
- **коментарі** (з медіа) з видимістю «для всіх» або «лише технічному цеху»;
- **експорт у PDF** (print‑view) для тих, кому зручний папір;
- **мінімум ролей:** технічний цех редагує, швеї коментують.

---

## 2. Цільова аудиторія
- експериментальні цехи / технологи (редактори);
- спеціалісти виробництва / оператори швейного обладнання (коментатори).

---

## 3. Аналоги та відмінності
- **PLM/ERP** (Centric PLM, ApparelMagic тощо): комплексні, дорогі, з довгим впровадженням;
- **Digital Work Instructions**‑платформи (Tulip, Dozuki, VKS, SwipeGuide): промислові рішення;
- **відмінність 4FIT:** вузьке швейне призначення, простота, миттєва користь, можливість друку.

---

## 4. C4 Level 1: System Context

```mermaid
flowchart LR
  %% People
  P1([Editor / Technologist]):::person
  P2([Operator / Seamstress]):::person

  %% System of interest (black box)
  S[4FIT Web App]:::system

  %% External software systems & data stores
  AUTH[Firebase Auth / IdP]:::ext
  DB[(Firestore Database)]:::data
  STORE[(Object Storage for Media)]:::data
  CDN[Edge CDN / Hosting]:::ext
  PDFW[PDF Rendering Worker]:::ext
  ANALYTICS[Analytics / RUM]:::ext
  NOTIFY[Notifications / FCM]:::ext

  %% Interactions
  P1 -->|create & edit instructions| S
  P2 -->|view & execute steps| S

  S -->|authenticate users| AUTH
  S -->|store & query docs| DB
  S -->|upload / fetch media| STORE
  S -->|serve static assets via| CDN
  S -->|request PDF generation| PDFW
  S -->|collect usage metrics| ANALYTICS
  S -->|send push notifications| NOTIFY
```

---

