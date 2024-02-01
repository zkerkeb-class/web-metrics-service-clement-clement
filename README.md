# WEB SERVICE (Ynov) - Service dédié à la collecte et à la visualisation de métriques

## Description du service

**Objectif** : Développer un service pour collecter, stocker et visualiser des métriques et des données d'utilisation provenant d'autres services.

**Fonctionnalités clés** :

- Collecte de métriques en temps réel des différents microservices.
- Stockage et gestion efficace des données de métriques.
- Création de tableaux de bord pour la visualisation des données.
- Fonctionnalités de reporting et d'analyse des tendances.

> Tout les micro-services devront faire remonter leur vitals et des informations clés, et le tout devra être récupéré par prometheus et visualisé via grafana.

## Project members

- Clément DUFOUR-LAMARTINIE
- Clément WALSH DE SERRANT

## Installation and configuration

Run `npm install`

Create `.env` file

.env configuration :

 <pre>
PORT=3006
 </pre>

## Run project

Run `npm run dev`
