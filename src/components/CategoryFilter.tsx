import { Category } from '@/lib/menuData'

interface CategoryFilterProps {
  categories: readonly Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex gap-3 justify-center min-w-max">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-2.5 rounded-full font-medium transition whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
