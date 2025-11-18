import type { FC } from "react"

export type ProductType = {
    id: string,
    name: string,
    price: number,
    description: string,
    photo: string
}

export type ProductProps = {
    product : ProductType
}

export const Produits: FC<ProductProps> = ({product}: ProductProps) => {
     return (
        <article className="border rounded-2 article">
            <p>{product.name}</p>
            <img className="img-fluid article-photo" src={product.photo} alt={product.name} />
            <p>{product.price}€</p>
            <p>{product.description}</p>
        </article>
  );
}