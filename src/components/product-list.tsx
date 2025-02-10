import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AddProductModal from "./add-product-modal"
import EditProductModal from "./edit-product-modal"
import type { Product } from "@/models/product"
import { SERVER_URL } from "@/models/server"
import { useState } from "react"

export default function ProductList() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(SERVER_URL + "/products")
      const res = (await response.json()).data as Product[]
      console.log(res)
      return res
    },
  })

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
  }

  const handleCloseEditModal = () => {
    setEditingProduct(null)
  }

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-5">List of products</h1>
      <AddProductModal />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name of product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products &&
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(product)}>
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit {product.name}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <EditProductModal product={editingProduct} isOpen={!!editingProduct} onClose={handleCloseEditModal} />
    </div>
  )
}
