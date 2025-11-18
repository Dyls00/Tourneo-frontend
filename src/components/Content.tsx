import { useEffect, useState, type FC, useReducer } from "react"
import { Produits, type ProductType } from "./Produits";
import { counterReducer } from "../CounterReducer";
import { useCounter } from '../counter'
import Button from '@mui/material/Button';

export const Content: FC = () =>{

  const {count,increment,decrement,reset} = useCounter()
  const [count2, dispatch] = useReducer(counterReducer, 0)


  useEffect(() => {
        const loadProducts = async () => {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts")
            const data = await response.json()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const products : ProductType[] = data.slice(0, 2).map((post: any) => {
                return {
                    id: post.id,
                    name: post.title,
                    price: Math.round(Math.random() * 100),
                    description: post.body,
                    photo: "/images/2.jpg"
                }
            })
            setProduct(products)
        }
        loadProducts()
    }, [])


  function loadMore(){
    const newProduit = {
        id:"1",
        name:"robe",
        price: 25,
        description:"Une très belle robe",
        photo:"/images/4.jpg"
    }

    setProduct((product) => [...product, newProduit])
  };

const [products, setProduct]= useState<ProductType[]>([{
  id:"1",
  name:"robe mariée",
  price: 25,
  description:"Une très belle robe de mariée",
  photo:"/images/5.jpg"
},{
  id:"2",
  name:"robe bleu",
  price: 25,
  description:"Une très belle robe bleu",
  photo:"/images/3.jpg"
},
])
     return (
        <div className="media">
            <div>
              <h2 className="center"> See all the products</h2>
            </div>
            <section>
              <div className="d-flex p-2 gap-2">
                {
                  products.map(product=>(
                    <Produits key={product.id} product={product}/>
                  ))
                }
              </div>
            </section>
            <div className="bto">
              {(products.length) < 3 && <Button variant="contained" onClick={loadMore}>Load more...</Button>}
            </div>
            <div className="row">
              <div className="col-6">
                <span>Nb of clicks (version useState): {count}</span>
                <button onClick={()=>increment()}>+1</button>
                <button onClick={()=>decrement()}>-1</button>
                <button onClick={()=>reset()}>Reset</button>
              </div>
              <div className="col-6">
              <span>Nb of clicks (versions useReducer): {count2}</span>
              <button onClick={()=> dispatch({type: 'INCREMENT'})}>+1</button>
              <button onClick={()=> dispatch({type: 'DECREMENT'})}>-1</button>
              <button onClick={()=> dispatch({type: 'RESET'})}>Reset</button>
              </div>
            </div>
        </div>
  );
}