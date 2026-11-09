interface LinkProps {
    label: string;
    onClick: any;
}

const Link = ({label, onClick}: LinkProps) => {
  return (
    <button type="button"
        onClick={onClick}
        className="my-2.5 text-xs
        text-yegna-500 no-underline
        transition-colors duration-200
        hover:font-semibold hover:text-yegna-700
        dark:text-[#C5C5CE]
        dark:hover:text-[#FFAD52]"
    >
        {label}
    </button>
  )
}

export default Link