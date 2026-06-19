function Card(props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-4 border">
      <h3 className="text-xl font-bold mb-2">
        {props.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300">
        {props.description}
      </p>
    </div>
  );
}

export default Card;