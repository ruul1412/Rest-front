import CategoriesTable from "../components/CategoriesTable";
import { useCategories } from "../hooks/useCategories";

export default function CategoriesPage() {
  const { categories, loading, create, update, remove } = useCategories();

  return (
    <div className="px-4 md:px-10 mx-auto w-full py-6">
      <CategoriesTable
        categories={categories}
        loading={loading}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
      />
    </div>
  );
}