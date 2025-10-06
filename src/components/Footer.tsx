export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} Pho & Sushi. All rights reserved.
        </p>
      </div>
    </footer>
  )
}