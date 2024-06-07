import React, { useRef } from 'react';
import { Button } from '@fluentui/react-components'
import './Styles.css';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  pokemonName: string;
  pokemonSprite: string | undefined;
  pokemonType: string | undefined;
  onSubmit: (name: string) => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, pokemonName, pokemonSprite, pokemonType, onSubmit }) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let inputValue = inputRef.current?.value;
    onSubmit(inputValue!);    
  };
    
  if (!isOpen) {
    return null;
  }

  return (
    <form className="dialog-overlay" onSubmit={handleSubmit}>
      <div className="dialog-content">

        <div className='dialog-header'>
          <h3>Pokémon Capture</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>

        <div className='pokemon-infos'>
          <img src={pokemonSprite} alt={pokemonName}/>

          <div className='pokemon-text'>
            <p className='bold'>Name:</p>
            <p>{pokemonName}</p>
          </div>

          <div className='pokemon-text'>
            <p className='bold'>Type:</p>
            <p>{pokemonType}</p>
          </div>

        </div>

        <div className='form'>
          <label className='bold'>Wanna rename?</label>
          <input className='inputForm' ref={inputRef} type="text" placeholder={pokemonName} />
        </div> 

        <p className='advertise'>*The length of the renamed name must be between 3 and 50</p>

        <div className='capture-button'>
          <Button type='submit'>Capture</Button>
        </div>

      </div>
    </form>
  );
};

export default Dialog;
