import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PencilIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import AddProductModal from "./add-product-modal"
import EditProductModal from "./edit-product-modal"
import type { Product } from "@/models/product"
import { SERVER_URL } from "@/models/server"
import { useState, useCallback } from "react"
import { debounce } from "lodash"

export default function ProductList() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const { data: products } = useQuery({
    queryKey: ["products", searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `${SERVER_URL}/products${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`,
      )
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
    }, 300),
    [],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  return (
    <div className="container mx-auto py-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-5">List of products</h1>
      <div className="flex justify-between items-center">
        <Input type="text" placeholder="Search products by name or category..." onChange={handleSearchChange} className="max-w-sm" />
        <AddProductModal />
      </div>
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

