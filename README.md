# Hagiológio

Catálogo dos santos da Igreja Católica: festas litúrgicas, padroados, iconografia e retratos.

Site: https://petermtps.github.io/hagiologio/

## Recursos

- Favoritos salvos no navegador, com filtro próprio no catálogo.
- Compartilhar o link de um santo e gerar uma imagem (1080×1350) com retrato, festa e frase, pronta para WhatsApp e Instagram.
- Frases de alguns santos na ficha (`tools/frases.json`).
- Pode ser instalado como app (PWA) e funciona sem internet depois da primeira visita.

## Dados

`saints.json` é a base completa. O site carrega uma versão dividida, gerada por:

```
node tools/build-data.mjs
```

O script cria `data/index.json` (o que a lista, os filtros e a busca precisam) e `data/d/0.json` a `data/d/15.json` (os detalhes das fichas, carregados só quando uma ficha abre), e junta as frases de `tools/frases.json`. Rode de novo sempre que mudar `saints.json` ou as frases.

## Fontes e licenças

- Dados: [Wikidata](https://www.wikidata.org/) (CC0).
- Retratos: Wikimedia Commons e Wikipédia; cada imagem mantém sua própria licença (a ficha de cada santo traz o link da imagem original).
- Música: gravações livres do Wikimedia Commons (CC0 e domínio público) e "Agnus Dei X" de Kevin MacLeod (incompetech.com), licença Creative Commons: By Attribution 3.0.
