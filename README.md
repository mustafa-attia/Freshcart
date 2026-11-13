# FreshCart

FreshCart is a Next.js storefront for the Route Egypt e-commerce API. It includes a responsive home page, product/category/brand discovery and details, authentication, cart and wishlist management, checkout, and order history.

## Run locally

```bash
npm ci
npm run dev
```

The storefront connects to `https://ecommerce.routemisr.com/api/v1`. Authentication tokens and the signed-in user are saved in browser local storage so authenticated cart, wishlist, password, and order requests can include the API token.

## Storefront routes

- `/` — home page
- `/products`, `/product/[productId]` — catalog and product details
- `/categories`, `/categories/[categoryId]` — category browsing and details
- `/brands`, `/brands/[brandId]` — brand browsing and details
- `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/change-password` — account flows
- `/cart`, `/wishlist` — saved and active shopping items
- `/checkout` — cash-on-delivery or online payment
- `/orders` — signed-in user's orders

## Checks

```bash
npm run lint
npm run build
```
