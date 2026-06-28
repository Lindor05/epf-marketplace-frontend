# EPF Marketplace — Frontend React

Application marketplace full-stack développée dans le cadre du projet CSI Bachelor 3.  
Binôme : **Lindor & Luce**

---

## Stack technique

| Élément | Choix |
|---------|-------|
| Build tool | Vite + React |
| UI | Tailwind CSS |
| HTTP | Axios (instance centralisée) |
| Formulaires | react-hook-form |
| Routing | React Router DOM v6 |
| État global | Context API (AuthContext, CartContext) |
| Toasts | react-hot-toast |

---

## Prérequis

- Node.js 18+
- Backend Laravel démarré sur `http://localhost:8000`  
  (voir [github.com/libasseld/epf-marketplace](https://github.com/libasseld/epf-marketplace))

---

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/Lindor05/epf-marketplace-frontend.git
cd epf-marketplace-frontend/frontend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
# Éditer le fichier .env et renseigner l'URL du backend :
# VITE_API_URL=http://localhost:8000/api

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:5173](http://localhost:5173).

---

## Variable d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL de base de l'API Laravel | `http://localhost:8000/api` |

---

## Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Acheteur | buyer@example.com | secret12 |
| Vendeur | seller@example.com | secret12 |
| Admin | admin@example.com | secret12 |

Coupon de réduction : `DEMO10` (-10% pour un panier ≥ 20 FCFA)

---

## Structure du projet

```
frontend/src/
├── components/     # Composants réutilisables (Navbar, Footer, Spinner, Skeleton…)
├── contexts/       # AuthContext.jsx, CartContext.jsx
├── hooks/          # useAuth.js, useCart.js
├── pages/          # Une page par route (Login, Register, Home, Cart…)
│   ├── seller/     # Dashboard, MyProducts, AddProduct, EditProduct, SellerOrders
│   └── admin/      # AdminStats, AdminUsers, AdminProducts, AdminCoupons
└── services/       # api.js + services par domaine (auth, product, order…)
```

---

## Fonctionnalités

### Acheteur
- Parcourir le catalogue avec filtres catégorie / prix / tri et pagination
- Recherche globale de produits
- Fiche produit avec avis clients
- Panier persistant (localStorage) avec modification des quantités
- Passer une commande avec adresse de livraison et coupon optionnel
- Historique et détail des commandes
- Gestion des favoris
- Messagerie avec les vendeurs

### Vendeur
- Tableau de bord avec statistiques (produits, commandes, chiffre d'affaires)
- Gestion des produits : ajout (avec images + promo flash), modification, suppression
- Suivi et mise à jour du statut des commandes reçues
- Messagerie avec les acheteurs

### Administrateur
- Statistiques globales de la plateforme
- Gestion des utilisateurs (suspendre / réactiver)
- Modération des produits (changer le statut, suppression forcée)
- Gestion des coupons de réduction (CRUD complet)

---

## Démarrer le backend

```bash
# Depuis la racine du projet Laravel
php artisan migrate --seed
php artisan serve
```
