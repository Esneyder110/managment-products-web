import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AddProductModal from "./add-product-modal"
import { Product } from "@/models/product"
import { SERVER_URL } from "@/models/server"

export default function ProductList() {
  
  const {data: products} = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(SERVER_URL + '/products')
      const res = (await response.json()).data as Product[]
      console.log(res)
      return res 
    }
  })

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-5">Lista de Productos</h1>
      <AddProductModal />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Producto</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon">
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Editar {product.name}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
