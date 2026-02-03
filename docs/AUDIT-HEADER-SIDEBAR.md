# Audit : Header, Burger & Sidebar (Brainstorm)

**Date** : 2026-02  
**Contexte** : Problèmes signalés — "header et burger cassé", "passe sous la croix quand sidebar ouvert".

---

## 1. Stack actuel (z-index & position)

| Élément | Position | Z-index | Dimensions / Remarques |
|--------|----------|---------|-------------------------|
| **DemoBadge** | `fixed top-0` | **50** | h-7 (28px), toute la largeur |
| **Burger / Croix** | `fixed top-7 left-4` | **50** | 44×44px, `lg:hidden` |
| **Overlay** | `fixed inset-0` | **35** | Affiché uniquement quand `isOpen` |
| **Sidebar (aside)** | `fixed top-7 left-0` | **40** | w-64, h-[calc(100vh-1.75rem)] |
| **Zone contenu** | `relative` + `pt-7 pl-16 lg:pl-64` | **10** | Contient Topbar + main |
| **Topbar** | `sticky top-7` | **20** (dans contexte 10) | h-14 |

Ordre d’empilement voulu (du dessous au dessus) :  
Contenu (10) → Overlay (35) → Sidebar (40) → Burger (50). DemoBadge (50) en haut, pas de chevauchement avec le burger (bandeau 0–28px, burger 28–72px).

---

## 2. Points vérifiés / OK

- **Burger toujours cliquable** : z-50, au-dessus de l’overlay (35) et de la sidebar (40).
- **Pas de chevauchement burger / contenu** : zone principale en `pl-16` sur mobile, le header commence à 64px, le burger s’arrête à ~60px.
- **Titre sidebar sous la croix** : bloc titre avec `pt-12` sur mobile, le texte commence sous le bouton fermer (28 + 48px).
- **Overlay ferme le menu** : clic sur overlay (z-35) déclenche `setIsOpen(false)`.
- **Sidebar au-dessus de l’overlay** : z-40 > z-35, la barre latérale reste visible à gauche.

---

## 3. Risques / Améliorations

### 3.1 Dropdown notifications (Topbar)

- Le panneau "Notifications" a un `z-50` **à l’intérieur** du Topbar, lui-même dans la zone `z-10`.
- En stacking context, tout le contenu (y compris le dropdown) reste sous overlay (35) et sidebar (40).
- **Risque** : si l’utilisateur ouvre les notifications puis le menu mobile, le dropdown peut passer derrière l’overlay/sidebar.
- **Recommandation** : fermer le dropdown notifications à l’ouverture du menu (`isOpen`), ou monter le dropdown dans un portal (ex. `createPortal`) avec un z-index > 40.

### 3.2 Alignement vertical (top-7)

- Tout est aligné sur `top-7` (28px) pour coller sous le bandeau DEMO (h-7 = 28px). Cohérent.
- Si on change la hauteur du DemoBadge, il faudra mettre à jour : `top-7`, `pt-7`, `h-[calc(100vh-1.75rem)]`, et le `pt-12` du header de la sidebar.

### 3.3 Overflow

- Zone contenu : `overflow-x-hidden` → évite le scroll horizontal, pas de débordement.
- Header Topbar : pas d’`overflow-hidden` pour ne pas couper le dropdown. OK.

### 3.4 Accessibilité

- Burger : `aria-label` dynamique (Ouvrir / Fermer le menu). OK.
- Overlay : `aria-hidden` pour ne pas être lu deux fois. OK.
- Nav : `aria-label="Navigation principale"`. OK.
- **Recommandation** : quand la sidebar est ouverte, ajouter `aria-expanded="true"` sur le burger et éventuellement `inert` ou `aria-hidden="true"` sur le main pour le lecteur d’écran.

### 3.5 Focus (clavier)

- À l’ouverture du menu, le focus pourrait être déplacé vers le premier lien de la nav ou vers le bouton fermer pour une meilleure navigation au clavier.
- À la fermeture, remettre le focus sur le burger.

---

## 4. Checklist rapide

- [x] Burger au-dessus de l’overlay et de la sidebar (z-50).
- [x] Contenu (header + main) ne passe pas sous le burger (pl-16).
- [x] Titre sidebar ne passe pas sous la croix (pt-12).
- [x] Overlay ferme bien le menu au clic.
- [x] Ordre z-index cohérent : contenu 10 < overlay 35 < sidebar 40 < burger 50.
- [ ] Dropdown notifications : comportement quand le menu mobile est ouvert (à traiter si besoin).
- [ ] Gestion du focus à l’ouverture/fermeture du menu (amélioration a11y).

---

## 5. Fichiers concernés

- `src/app/(app)/layout.tsx` — structure, pt-7, pl-20 (mobile), pl-72 (lg), z-10.
- `src/components/layout/Sidebar.tsx` — burger, overlay, aside, pt-12, z-35/40/50.
- `src/components/layout/Topbar.tsx` — sticky top-7, z-20, dropdown.
- `src/components/layout/DemoBadge.tsx` — h-7, z-50.

Si après ces vérifications le header ou le burger semblent encore "cassés" (ex. sur un device ou une taille d’écran précise), préciser le cas (mobile/desktop, taille, action effectuée) pour cibler le correctif.

---

## 6. Audit mode mobile & centrage

**Constat** : En vue mobile, le bloc de contenu blanc peut paraître décentré (aligné à gauche avec bande grise à droite si la fenêtre est plus large que le viewport mobile, ou zone de contenu qui ne remplit pas correctement l'espace).

### 6.1 Structure actuelle

| Élément | Mobile | Remarque |
|--------|--------|----------|
| Zone contenu (wrapper) | `pl-16 pr-16` (64px gauche et droite) | Symétrie + plus de largeur pour le contenu (liste, tableaux) ; burger à 16px, fin à 60px. |
| Main | `w-full max-w-screen-xl mx-auto pt-4 pr-0 pb-4 pl-0 lg:p-6` | En mobile : pas de padding horizontal (wrapper gère les 64px) ; en lg : p-6. |
| Topbar (contenu) | `pl-16 pr-16 lg:pl-72 lg:pr-6` | Mobile : 64px des deux côtés (aligné sur le wrapper) ; desktop : pr-6. |

### 6.2 Problèmes identifiés

1. **Centrage du conteneur** : Le wrapper de la zone principale n'a pas de `w-full` explicite. Sur certains contextes (iframe, prévisualisation, flex parent futur), la zone peut ne pas occuper toute la largeur et donner l'impression d'un bloc blanc décentré à gauche.
2. **Asymétrie gauche/droite (corrigée)** : En mobile, on avait `pl-20` (80px) à gauche et `pr-4` (16px) à droite → contenu « poussé » à droite. **Correction** : marges symétriques en mobile. Puis **plus de largeur** : `pl-16 pr-16` (64px) au lieu de 80px, pour gagner ~32px de largeur utile (liste, tableaux) tout en gardant le centrage et en évitant le chevauchement du burger (burger fin à 60px, contenu à 64px).
3. **« Marche » à gauche** : Le contenu du main avait `p-4` (16px de chaque côté), donc le texte commençait à 80px + 16px = **96px**. La Topbar commence à **80px** (pl-20). Ce décalage de 16px créait une « marche » visuelle à gauche. Correction : en mobile, `main` utilise `pl-0` (et `pt-4 pr-4 pb-4`), pour que le contenu démarre à 80px comme la Topbar ; en `lg`, `p-6` partout.
4. **Alignement des contenus** : Titres, recherche et listes sont alignés à gauche dans le bloc blanc — choix de design cohérent pour la lisibilité ; seul le logo/blason est centré dans la Topbar sur mobile.

### 6.3 Recommandations

- **Wrapper zone principale** : Ajouter `w-full` pour garantir que la zone occupe toute la largeur disponible et que le `main` avec `mx-auto` soit bien centré dans cet espace.
- **Symétrie mobile** : `pl-20 pr-20` sur le wrapper et la Topbar en mobile pour centrage visuel (80px gauche et droite).
- **Vérifier** : En prévisualisation mobile (DevTools ou émulateur), s'assurer que la largeur de la zone contenu = viewport − `pl-20`, sans bande grise à droite.

### 6.4 Fichiers à modifier

- `src/app/(app)/layout.tsx` — wrapper : ajouter `w-full` ; optionnel : `pr-4` en mobile pour symétrie.
- `src/styles/globals.css` — `html`, `body` : `w-full max-w-full min-w-0` pour éviter toute réduction de largeur en héritage.
- Racine (app) layout : conteneur avec `w-full max-w-full min-w-0` pour garantir la pleine largeur.

### 6.5 Bande sombre à droite (vue mobile)

Si une **bande sombre** apparaît à droite en mode mobile :

1. **Cadre appareil (DevTools)** : Avec les outils de développement (Chrome DevTools, mode responsive + « Show device frame »), le viewport affiché est la taille du téléphone ; la bande sombre est alors le **cadre du téléphone** dessiné par le navigateur. L’app remplit bien l’écran du device ; le décentrage perçu est celui du cadre dans la fenêtre du navigateur. → Désactiver le cadre appareil pour vérifier que le contenu remplit bien la zone.
2. **Largeur limitée** : Si la bande reste visible sans cadre (fenêtre étroite ou iframe), les garde-fous ajoutés (`html`/`body`/racine en `w-full max-w-full`) doivent faire occuper à l’app toute la largeur disponible. Vérifier qu’aucun parent (iframe, conteneur d’intégration) n’impose une `max-width` inférieure au viewport.
