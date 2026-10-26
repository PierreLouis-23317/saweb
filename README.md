# SAWEB

Galerie photo humoristique consacrée à Sohaib. Le site est entièrement statique : HTML, CSS et JavaScript vanilla, sans dépendance ni backend. Les lenteurs sont simulées, les fichiers restent légers.

## Ajouter ses photos

1. Copiez vos images dans [`images/`](./images/).
2. Ouvrez [`script.js`](./script.js) et modifiez le tableau `photos` :

   ```js
   const photos = [
     { src: "images/ma-photo.jpg", caption: "Une légende pour Sohaib" }
   ];
   ```

3. Ajoutez autant d'objets que nécessaire. Les chemins sont relatifs à `index.html`. Les formats JPG, PNG, WebP et SVG fonctionnent dans les navigateurs modernes.

Les SVG fournis sont des images de démonstration. Vous pouvez les conserver, les remplacer ou les supprimer du tableau.

## Publier sur GitHub Pages

1. Créez un dépôt GitHub et envoyez les fichiers (`index.html`, `style.css`, `script.js`, `README.md` et `images/`).
2. Dans le dépôt, ouvrez **Settings > Pages**.
3. Choisissez **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)`.
4. Enregistrez. GitHub Pages fournira l'adresse du site après quelques instants.

Le projet n'utilise aucune route serveur : les chemins relatifs sont donc compatibles avec GitHub Pages, y compris lorsque le site est publié sous un sous-dossier.

## Modifier les temps simulés

- Faux chargement initial : `duration` et le délai final dans `fakeBoot()`.
- Chargement des vignettes : les valeurs `2000` et `6000` dans `renderGallery()`.
- Chargement de la visionneuse : les valeurs `1000` et `2000` dans `openLightbox()`.

Ces délais n'empêchent pas les fichiers d'être téléchargés rapidement : ils ne font qu'attendre avant de les révéler.
