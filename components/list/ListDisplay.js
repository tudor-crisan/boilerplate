
export default function ListDisplay({ list, type = "Board" }) {
  return (
    <div>
      <h1 className="font-extrabold text-xl mb-4">
        {list.length} {type}{list.length > 1 ? 's' : ''}
      </h1>
      <ul className="space-y-4">
        {list.map(item => (
          <li
            key={item._id}
            className="bg-base-100 p-6 rounded-3xl"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )
}