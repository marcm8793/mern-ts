# Pass Management/Users

## Démarrer le projet

```bash
docker compose up
```

### BackEnd

[http://localhost:8080/](http://localhost:8080/)

### FrontEnd

[http://localhost:5173/](http://localhost:5173/)

### DB drop//DB seed

```bash
npm run seed
```

_NB: Commande déjà effectuée via le docker compose up._

## Effectuer les tests

### Testing des routes

[http://localhost:8080/api-docs/](http://localhost:8080/api-docs/)

Il convient d'enregistrer un nouvel utilisateur afin de récupérer un token. Celui-ci doit être ajouté dans Authorize en haut de la page afin d'accéder à tous les endpoints.

### Testing des controllers

1. Récupérer le nom ou l'ID du container :

```bash
docker ps
```

2. Executer cette commande en console pour récupérer l'ID du container serveur :

```bash
docker exec -it <container_name_or_id> /bin/bash
```

3. Lancement des tests via le script :

```bash
npm test
```

## Tech stack

**MERN**

- Mongo pour la BDD ➡️ Une base DEV ainsi qu'une base TEST
- ExpressJS pour le backend
- React pour le frontend
- NodeJS pour le runtime server

**Jest**
Pour le testing backend

**TypeScript**
L'ensemble du projet est rédigé en TypeScript pour le typage des données.

**Swagger-UI**
Pour le testing des API.

**Axios**
Pour effectuer des requêtes HTTP depuis le frontend.

**JWT (JSON Web Tokens)**
Pour sécuriser les endpoints de l'API avec une authentification basée sur des tokens.
Ajout de passwords dans la BDD pour l'authentificaiton des utilisateurs.

**TailwindCSS**
Pour le css frontend.

## Potentionnelles features pour le projet

### Backend

- Ajout d'un rôle d'admin pour la gestion des utilisateurs et des tokens d'accés
- Recours à des cookies plutôt qu'à des JWT en local storage afin de diminuer l'exposition aux attaques XSS.

### Frontend

- Refactoring via l'utilisation de components
- Utilisation d'un context manager pour diminuer le recours aux nombreux useStates
- Mise en place d'un routing system pour avoir plusieurs pages via react-router ou nextjs
- Ajout d'un module de validation des données au niveau des formulaires via zod

Merci de m'avoir lu 😀
