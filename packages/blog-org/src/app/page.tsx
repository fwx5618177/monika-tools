import { getDefaultHomeData } from "@/services/fetchInitialProps/home/getDefaultData";
import HomePage from "@/views/Home";

export default async function Page() {
  const defaultData = await getDefaultHomeData();

  return (
    <main className="flex flex-col gap-8">
      <HomePage {...defaultData} />
    </main>
  );
}
