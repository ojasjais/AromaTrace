/**
 * Props:
 * variant: primary | secondary | outline
 * size: sm | md | lg
 * disabled: boolean
 * onClick: function
 */

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
}) {
  let baseStyle = "rounded font-semibold";

  let variantStyle =
    variant === "primary"
      ? "bg-green-600 text-white"
      : variant === "secondary"
      ? "bg-gray-500 text-white"
      : "border border-gray-500 text-gray-700";

  let sizeStyle =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : "px-4 py-2";

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;