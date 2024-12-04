# Securisation JWT

Ce projet a pour objectif d'ajouter une authentification sécurisée sur une application existante.
Cela sera fait en utilisant la librairie `jsonwebtoken` qui permet la construction d'un jeton sécurisé, comportant des informations sur l'utilisateur connecté, ici le rôle, autorisant ou pas l'accès à des ressources protégées.

## Installation

1. Cloner le projet (ou le dézipper)
2. Avec le terminal, se positionner à la racine du projet
3. Installer les dépendances : `npm install`
4. Démarrer le projet : `npm run start`
5. Connecter le front sur `localhost:3000/login`

## Fonctionnement

### Utilisation de la clé secrète

La génération du token dépend d'une clé secrète. La librairie `dotenv` permet d'accéder à des variables d'environnement stockées dans un fichier `.env`, qui doit être ajouté à un `.gitignore` pour ne pas être exposé. Mais pour permettre à d'autres d'utiliser correctement cette configuration, un fichier `.env.exemple` expose la structure de ce fichier.

Un fichier `config.js` permet d'accéder aux variables d'environnement du fichier `.env` et les rendent accessibles aux sources de l'application.

Cette solution permet de rendre inaccessible la clé secrète.

### Utilisation d'un middleware d'authentification

Nous créons un middleware d'authentification, dont le but est de:

1. Récupérer le token d'identification dans les cookies
2. S'il n'existe pas (c'est à dire si l'utilisateur n'est pas connecté), renvoie une erreur `401`
3. S'il existe, vérifie le token
4. Si le token est validé, ajoute l'utilisateur dans le req.user (ce qui confirme son authentification et son rôle)
5. Renvoie une erreur si le token n'est pas valide

#### Conditions de validité du token

Un token est formé de 3 parties:

- le **header** : comporte l'algorithme de chiffrage et le type de token (ici JWT)
- le **payload** :  comporte les données qui interressent l'application (ici, user.id, user.role, expiration du token)
- la **signature** : chiffrage sur la bas64 formé depuis la clé secrète. La clé secrète étant inaccessible de l'extérieur, chaque signature est unique et infalsifiable. Comme elle est formée depuis le header et le payload, chaque clé dépend aussi du rôle de l'utilisateur, ce qui nous intéresse ici.

#### Exemple : 

##### Token pour un user :

```jwt
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6MSwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzMzMDYwMDgsImV4cCI6MTczMzMwOTYwOH0.
Qyt5q8jgstmZmLJnShpmZTOrGPUINZKjvmOqvcmkl1M"
```

##### Token pour un admin :

```jwt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMzMzA2MDA4LCJleHAiOjE3MzMzMDk2MDh9.
D1W5Rd3iXjiY7gudw_GO6JepbggEi5scNIZ5-XVeI4c
```

Ces deux tokens sont formés avec la même clé secrète et le même algorithme. On remarque que la première partie, le **header**, est identique :

```jwt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

Le payload et la signature sont différents, puisque les rôles sont différents. Cela garantit la sécurité de l'accès aux ressources protégées.

Il est donc impossible (pour l'instant) de générer un token sans connaître la clé secrète depuis l'extérieur de l'application.

### Gestion des routes

L'application gère trois cas :

1. **Utilisateur non connecté** : il n'y a pas de token, l'accès est interdit sur toutes les routes et un message d'erreur est renvoyé

2. **Utilisateur connecté en tant que `user`** : l'accès à la route `/user` est possible, l'accès à la route '/admin' est refusé

3. **Utilisateur connecté en tant qu' `admin`** : l'accès à la route `/user` et à la route '/admin' est possible.