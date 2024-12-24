import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ProductsTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-400">Product Name</TableHead>
          <TableHead className="text-gray-400">Category</TableHead>
          <TableHead className="text-gray-400">Price</TableHead>
          <TableHead className="text-gray-400">Total Sales</TableHead>
          <TableHead className="text-gray-400">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium text-white">{product.title}</TableCell>
            <TableCell className="text-white">{product.category}</TableCell>
            <TableCell className="text-white">${isNaN(Number(product.price)) ? '0.00' : Number(product.price).toFixed(2)}</TableCell>
            <TableCell className="text-white">{product.totalSales}</TableCell>
            <TableCell className="text-white">${isNaN(Number(product.revenue)) ? '0.00' : Number(product.revenue).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}