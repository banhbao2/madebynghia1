export default function PickupInfo() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="text-3xl">📍</div>
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Abholort</h3>
          <p className="text-gray-700 font-medium">
            Hauptstraße 123<br />
            Ihre Stadt<br />
            <span className="text-sm text-gray-600 mt-2 block">
              Wir benachrichtigen Sie, sobald Ihre Bestellung fertig ist!
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
