import { customerService } from "@/service/api/customerService";

export default async function TestApiPage() {
  const customers = await customerService.getAll();

  return (
    <pre>{JSON.stringify(customers, null, 2)}</pre>
  );
}