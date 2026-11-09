export type InputType = "text" | "email" | "password";


interface AnimInputProps {
  type: InputType;
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

export const AnimInput = ({ type = "text", label, required, value, onChange }: AnimInputProps) => {
    return (
        <div className='relative mt-[clamp(1.5rem,4vh,2.2rem)] w-full'>
          <input
            id={label.toLocaleLowerCase()}
            name={label.toLocaleLowerCase()}
            type={type}
            value={value}
            required={required}
            autoComplete={label}
            className='peer relative z-10 w-full bg-transparent border-none outline-none shadow-none
                px-2.5 pt-5 pb-2.5 text-base text-yegna-900 dark:text-[#FFF0DE] 
                transition-all duration-500' 
            onChange={onChange}/>

          <label htmlFor={label.toLocaleLowerCase()} 
            className='absolute left-0 top-0 px-2.5 pt-5 pb-2.5 pointer-events-none text-base 
                text-[#557260] dark:text-[#B8B9C4] transition-all duration-500 peer-focus:text-xs peer-valid:text-xs 
                peer-focus:-translate-y-8.5 peer-valid:-translate-y-8.5 peer-focus:text-yegna-600 
                peer-valid:text-yegna-600 dark:peer-focus:text-[#FF851B] dark:peer-valid:text-[#FF851B]'>
            {label}
          </label>

          <i className='absolute inset-x-0 bottom-0 h-0.5 w-full overflow-hidden rounded bg-yegna-100 dark:bg-[#38333A]
                pointer-events-none transition-all duration-500 peer-focus:h-11 peer-valid:h-11 
                peer-focus:bg-yegna-100 peer-valid:bg-yegna-100 dark:peer-focus:bg-[#35281F] 
                dark:peer-valid:bg-[#35281F]' />
        </div>
    )
}