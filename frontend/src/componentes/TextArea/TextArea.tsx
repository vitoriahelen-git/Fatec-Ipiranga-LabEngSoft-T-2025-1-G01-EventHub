import './TextArea.css'

export const TextArea = ({titulo = 'Digite seu Texto', onChange,valor, name, placeholder = 'digite aqui...',maximo = 2000, contador = true, obrigatorio = false, cor='var(--purple-700)'}:any) => {


    const atualizaContador = ()=>{
        return  <div className={`contador ${contador ? 'd-block' : 'd-none'}`}>{`${valor.length}/${maximo}`}</div>
    }

  return (
    <div>
        <label htmlFor={name} className={`textarea__label ${titulo? 'd-block':'d-none'}`}>{titulo}</label>
        <div className='textarea__container'>
            <textarea 
                style={{'--cor-principal': cor} as React.CSSProperties}
                className='textarea' 
                placeholder={placeholder}
                onChange={onChange}
                value={valor}
                maxLength={maximo}
                name={name}
                id={name}
                required={obrigatorio}
            />
            {atualizaContador()}
        </div>
        
    </div>
    
  )
}
export default TextArea
