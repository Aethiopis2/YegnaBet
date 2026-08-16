type Props = {
    items: any[];
    selected?: number;
    onSelect: (id?: number) => void;
};

const CategoryChips = ({items, selected, onSelect}: Props) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => onSelect(undefined)} 
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap 
                ${ !selected ? 'bg-emerald-600 text-white' : 'bg-white border' }`}> All 
            </button>

            {items.map(c => ( 
                <button key={c.id}
                    onClick={() => onSelect(c.id)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap 
                    ${ selected === c.id ? 'bg-emerald-600 text-white' : 'bg-white border' }`} > 
                        {c.name} 
                </button> ))}
        </div>
    );
}

export default CategoryChips